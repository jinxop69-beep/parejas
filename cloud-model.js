export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function errorText(e){const t=String(e?.message||e||'');const code=e?.code||'';
 if(/Invalid login credentials/i.test(t))return 'El correo o la contraseña no coinciden. Revísalos o recupera el acceso.';
 if(/Email not confirmed/i.test(t))return 'Abre el correo de confirmación antes de entrar. Puedes solicitar otro enlace.';
 if(/rate.limit|too many|after.*seconds/i.test(t)||e?.status===429)return 'Se han hecho varios intentos seguidos. Espera unos minutos antes de repetir.';
 if(/Email address not authorized|email_address_not_authorized|Error sending confirmation email|Error sending recovery email/i.test(t+' '+code))return 'Supabase no ha podido enviar el correo. El titular debe configurar el servicio SMTP; el correo de prueba no admite todas las direcciones.';
 if(/signup.*disabled/i.test(t))return 'El registro está desactivado en este proyecto. Hay que habilitarlo en Supabase.';
 if(/ENTRE_CONFLICT/.test(t))return 'Este registro ha cambiado. Tu borrador sigue aquí: copia lo que quieras conservar, cierra y vuelve a abrir la versión actual antes de editar.';
 if(/ENTRE_INVITE_INVALID/.test(t))return 'El código no es válido, ha caducado o ya se ha usado. Pide una nueva invitación.';
 if(/ENTRE_ALREADY_LINKED|ENTRE_SPACE_FULL/.test(t))return 'Esta cuenta o este espacio ya tiene un vínculo. Revísalo en Nosotros antes de continuar.';
 if(/ENTRE_LINK_REQUIRED|ENTRE_PARTNER_REQUIRED/.test(t))return 'Primero debéis vincular vuestras dos cuentas desde Nosotros.';
 if(/ENTRE_ROUND_SEALED/.test(t))return 'La ronda ya está cerrada a cambios. Consulta las coincidencias o cerradla para empezar otra.';
 if(/ENTRE_NOT_ALLOWED/.test(t))return 'Ya no tienes acceso a este registro o la ronda ha terminado. Actualiza el espacio.';
 if(code==='PGRST202'||/function.*schema cache|relation.*does not exist/.test(t))return 'Falta aplicar la estructura de ENTRE en Supabase. Revisa las instrucciones de instalación.';
 if(/fetch|network|timeout|Failed to|abort/i.test(t))return 'No hemos podido confirmar la conexión. Tu texto sigue en este formulario; no cierres la página. Revisa la conexión y vuelve a intentarlo.';
 return e?.userMessage||'No se pudo completar. Tu texto sigue aquí. Revisa la conexión e inténtalo de nuevo.';
}
export function agreementState(r){return r.shared&&(r.accepted_by||[]).length===2?'Aceptado por ambos':(r.accepted_by||[]).length?'Falta una aceptación':'Propuesta por hablar'}
export function visibleRecords(records,uid,verified){return records.filter(r=>!r.deleted_at&&(verified||r.owner_id===uid));}
export function privateImportPayload(row){if(!row||!['checkin','note','agreement','appreciation','completion','seen','favorite','date'].includes(row.kind)||!row.payload||typeof row.payload!=='object'||Array.isArray(row.payload))throw Error('invalid backup');const p=structuredClone(row.payload);delete p.accepted;delete p.accepted_by;delete p.status;if(JSON.stringify(p).length>40000)throw Error('too large');return {kind:row.kind,payload:p,shared:false};}
