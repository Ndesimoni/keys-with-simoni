from playwright.sync_api import sync_playwright
from pathlib import Path
root=Path('/mnt/data/keys-with-simoni-react/public')
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':390,'height':844},accept_downloads=True)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content('<html><head></head><body><div id="root"></div></body></html>')
 page.evaluate("Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:function(k){return this[k]||null},setItem:function(k,v){this[k]=v},removeItem:function(k){delete this[k]}}})")
 page.add_style_tag(content=(root/'styles.css').read_text().split('\n',1)[1])
 for script in ['vendor/react.production.min.js','vendor/react-dom.production.min.js','vendor/jszip.min.js','vendor/hooks-shim.js','schema.js','demo-data.js','app.js']:
  page.add_script_tag(content=(root/script).read_text())
 page.screenshot(path='/mnt/data/keys_with_simoni_react_mobile.png',full_page=True)
 page.locator('.hamburger').click()
 assert page.locator('.sidebar-open').count()==1
 page.locator('.sidebar .nav-item',has_text='Clients').click()
 text=page.locator('input[placeholder="Search records..."]')
 text.press_sequentially('Olivia',delay=20)
 print('Filter while typing retains focus:',text.evaluate('(e)=>document.activeElement===e'))
 print('Matched clients:',page.locator('.data-table tbody tr').count())
 page.once('dialog',lambda d: d.accept())
 page.locator('input[type=file]').set_input_files('/mnt/data/keys_with_simoni_ui_export.xlsx')
 page.wait_for_timeout(1800)
 print('Import message:',page.locator('.toast').inner_text() if page.locator('.toast').count() else 'none')
 print('Imported Test Buyer:',page.locator('.sidebar .nav-item',has_text='Clients').count())
 print('Page errors:',errors)
 browser.close()
