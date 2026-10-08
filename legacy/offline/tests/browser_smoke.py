from playwright.sync_api import sync_playwright
from pathlib import Path
root=Path('/mnt/data/keys-with-simoni-react/public')
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1440,'height':1050},device_scale_factor=1)
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content('<!doctype html><html><head><title>Keys with Simoni</title></head><body><div id="root"></div></body></html>')
 page.evaluate("Object.defineProperty(window, 'localStorage', {configurable:true,value:{getItem:function(k){return this[k]||null},setItem:function(k,v){this[k]=v},removeItem:function(k){delete this[k]}}})")
 page.add_style_tag(content=(root/'styles.css').read_text().replace("@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');",''))
 for script in ['vendor/react.production.min.js','vendor/react-dom.production.min.js','vendor/jszip.min.js','vendor/hooks-shim.js','schema.js','demo-data.js','app.js']:
  page.add_script_tag(content=(root/script).read_text())
 print('REACT_VERSION',page.evaluate('React.version'))
 print('USESTATE',page.evaluate('typeof React.useState'))
 page.wait_for_timeout(500)
 print('ROOT_HEAD',page.locator('#root').inner_text()[:1150])
 print('ERRORS',errors)
 page.screenshot(path='/mnt/data/keys_with_simoni_react_dashboard.png',full_page=True)
 print('SCREEN',page.locator('main').count())
 browser.close()
