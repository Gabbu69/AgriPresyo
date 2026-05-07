(async () => {
  const origin = 'https://agripresyo.vercel.app';

  try {
    const res = await fetch(origin + '/');
    const html = await res.text();
    const scriptMatch = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (scriptMatch) {
      const jsRes = await fetch(origin + scriptMatch[1]);
      const js = await jsRes.text();
      console.log('canonical site:', origin);
      console.log('main JS chunk:', scriptMatch[1]);
      console.log('JS content-type:', jsRes.headers.get('content-type'));
      console.log('didForceRoleUpdate present?', js.includes('didForceRoleUpdate'));
      console.log('seller tips clean?', !js.includes('ðŸ'));
    } else {
      console.log('Could not find JS chunk');
    }
  } catch (e) { console.error(e); }
})();
