// Remove only the retired ENTRE local vaults. Cloud sessions and preferences are preserved.
export function clearLegacyData(getStorage=()=>globalThis.localStorage){
  try {
    const storage=getStorage();
    const keys=['entre.vault.v1','entre.local.v2','entre.html.vault.v1','entre.html.local.v2'];
    for(const key of keys)storage.removeItem(key);
    return keys.every(key=>storage.getItem(key)===null);
  } catch { return false; }
}
