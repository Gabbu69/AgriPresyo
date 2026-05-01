(async () => {
  try {
    const res = await fetch('https://agripresyo.vercel.app/');
    const html = await res.text();
    const scriptMatch = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (scriptMatch) {
      const jsRes = await fetch('https://agripresyo.vercel.app' + scriptMatch[1]);
      const js = await jsRes.text();
      console.log('agripresyo.vercel.app didForceRoleUpdate present?', js.includes('didForceRoleUpdate'));
    } else {
      console.log('agripresyo.vercel.app Could not find JS chunk');
    }
  } catch (e) { console.error(e); }

  try {
    const res = await fetch('https://agri-presyo.vercel.app/');
    const html = await res.text();
    const scriptMatch = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (scriptMatch) {
      const jsRes = await fetch('https://agri-presyo.vercel.app' + scriptMatch[1]);
      const js = await jsRes.text();
      console.log('agri-presyo.vercel.app didForceRoleUpdate present?', js.includes('didForceRoleUpdate'));
    } else {
      console.log('agri-presyo.vercel.app Could not find JS chunk');
    }
  } catch (e) { console.error(e); }
})();
