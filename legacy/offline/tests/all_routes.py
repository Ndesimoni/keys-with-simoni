from playwright.sync_api import sync_playwright
from pathlib import Path
root=Path('/mnt/data/keys-with-simoni-react/public')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox']); page=b.new_page(viewport={'width':1366,'height':900});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content('<html><head></head><body><div id="root"></div></body></html>')
 page.evaluate("Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:function(k){return this[k]||null},setItem:function(k,v){this[k]=v},removeItem:function(k){delete this[k]}}})")
 page.add_style_tag(content=(root/'styles.css').read_text().split('\n',1)[1])
 for script in ['vendor/react.production.min.js','vendor/react-dom.production.min.js','vendor/jszip.min.js','vendor/hooks-shim.js','schema.js','demo-data.js','app.js']:
  page.add_script_tag(content=(root/script).read_text())
 names=['Dashboard','Client desk','CRM insights','Clients','Contacts','Properties','Deals','Follow-ups','Viewings','Shortlist','Interaction log','Client care','Payments','Expenses','Date search','Performance','Guide']
 for name in names:
  page.locator('.sidebar .nav-item',has_text=name).click()
  title=page.locator('.page-heading h1').inner_text()
  print('PASS ROUTE:',name,'->',title)
  assert page.locator('.page-heading h1').count()==1
 print('ROUTES PASSED:',len(names),'JS ERRORS:',len(errors))
 if errors:print('\n'.join(errors));raise RuntimeError('Browser exceptions detected')
 b.close()
