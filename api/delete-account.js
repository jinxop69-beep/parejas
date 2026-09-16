// Vercel Node function. The administrative key exists only as a server environment variable.
const URL='https://sdusjqdiighwqhjoxtto.supabase.co';
const KEY='sb_publishable_2BvNFc-joAok32YopRcDRw_FD4aQijc';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Método no permitido.'})}
 const expected=process.env.APP_ORIGIN||'https://parejas-iota.vercel.app';
 if(req.headers.origin&&req.headers.origin!==expected)return res.status(403).json({error:'Abre esta acción desde tu app de ENTRE.'});
 const secret=process.env.SUPABASE_SECRET_KEY;
 if(!secret)return res.status(503).json({error:'Falta configurar el borrado de cuentas en Vercel. No se ha eliminado nada.'});
 const token=req.headers.authorization;
 if(!token||!/^Bearer [A-Za-z0-9_.-]+$/.test(token))return res.status(401).json({error:'Vuelve a entrar para confirmar tu identidad.'});
 const call=(path,options={})=>fetch(URL+path,{...options,signal:AbortSignal.timeout(10000)});
 try{
  const check=await call('/auth/v1/user',{headers:{apikey:KEY,Authorization:token}});
  if(!check.ok)return res.status(401).json({error:'Tu sesión no es válida. Vuelve a entrar.'});
  const user=await check.json();if(!/^[0-9a-f-]{36}$/i.test(user.id||''))return res.status(401).json({error:'No se pudo verificar tu identidad.'});
  const adminHeaders={apikey:secret,'Content-Type':'application/json'};
  // New sb_secret_ keys use apikey. Legacy JWT service-role keys also require Authorization.
  if(!secret.startsWith('sb_secret_'))adminHeaders.Authorization='Bearer '+secret;
  const preflight=await call('/auth/v1/admin/users/'+encodeURIComponent(user.id),{headers:adminHeaders});
  if(!preflight.ok)return res.status(503).json({error:'La configuración de borrado no es válida. No se ha eliminado nada. Revisa la clave de servidor en Vercel.'});
  const own=await call('/rest/v1/rpc/entre_delete_my_data',{method:'POST',headers:{apikey:KEY,Authorization:token,'Content-Type':'application/json'},body:'{}'});
  if(!own.ok)return res.status(502).json({error:'No se han podido borrar tus datos. Inténtalo de nuevo.'});
  const deleted=await call('/auth/v1/admin/users/'+encodeURIComponent(user.id),{method:'DELETE',headers:adminHeaders,body:JSON.stringify({should_soft_delete:false})});
  if(!deleted.ok)return res.status(502).json({error:'Tus datos se han borrado, pero tu cuenta de acceso sigue pendiente de eliminación. Vuelve a intentar eliminar la cuenta.'});
  return res.status(200).json({deleted:true});
 }catch{return res.status(502).json({error:'No se pudo confirmar el borrado completo. Revisa si puedes entrar y vuelve a intentarlo. No daremos la cuenta por eliminada sin confirmación.'})}
}
