import { formatPrice } from './data.js';
const esc = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const selectOptions = { category: ['Premium', 'Designer', 'Natural', 'Everyday'], stockStatus: [['in_stock', 'In stock'], ['out_of_stock', 'Out of stock / Sold out']], discount: ['', '15% OFF', '20% OFF', '25% OFF', '30% OFF', 'New'], rating: ['4', '4.5', '4.6', '4.7', '4.8', '4.9', '5'], color: ['Ivory', 'Black / Gold', 'Pearl White', 'Walnut', 'Champagne Gold', 'Snow White'], blades: ['3 blade', '4 blade', '5 blade'], size: ['48 inch', '52 inch', '56 inch'] };
const productFields = [['id','Slug / ID','text',true],['sku','SKU','text',true],['name','Product name','text',true],['price','Sale price (Rs.)','number',true],['oldPrice','Original price (Rs.)','number',true],['discount','Discount label','select',false],['rating','Rating','select',true],['reviews','Review count','number',true],['image','Primary image','image',true],['image2','Additional image 2','image',false],['image3','Additional image 3','image',false],['image4','Additional image 4','image',false],['category','Category','select',true],['stockStatus','Availability','select',true],['color','Finish / color detail','select',false],['blades','Blade detail','select',false],['size','Size','select',false],['description','Description','textarea',true]];
function inputField([key,label,type,required], product) {
  if (type === 'textarea') return `<label class="admin-field admin-field-wide">${label}${required?' *':''}<textarea name="${key}" ${required?'required':''}>${esc(product[key]||'')}</textarea></label>`;
  if (type === 'select') {
    const current = String(product[key] ?? '');
    const options = [...(selectOptions[key] || [])];
    const values = options.map((option) => String(Array.isArray(option) ? option[0] : option));
    if (current && !values.includes(current)) options.unshift([current, `${current} (current)`]);
    return `<label class="admin-field">${label}${required?' *':''}<select name="${key}" ${required?'required':''}>${options.map((option) => { const value = Array.isArray(option) ? option[0] : option; const text = Array.isArray(option) ? option[1] : option || 'No discount'; return `<option value="${esc(value)}" ${current === String(value) ? 'selected' : ''}>${esc(text)}</option>`; }).join('')}</select></label>`;
  }
  if (type === 'image') {
    const val = esc(product[key] || '');
    return `<div class="admin-field admin-field-image"><div class="admin-image-top"><span class="admin-image-title">${label}${required?' *':''}</span><label class="admin-upload-trigger"><input type="file" accept="image/*" class="admin-file-picker" data-target="${key}" /><span>📁 Upload image</span></label></div><div class="admin-image-row"><input name="${key}" id="input-${key}" type="text" value="${val}" placeholder="Upload file or paste URL" ${required?'required':''}/><div class="admin-img-thumb" id="thumb-${key}">${val?`<img src="${val}" alt="preview"/>`:'<span>No image</span>'}</div></div></div>`;
  }
  return `<label class="admin-field">${label}${required?' *':''}<input name="${key}" type="${type}" value="${esc(product[key] ?? '')}" ${required?'required':''}/></label>`;
}
function productForm(product = {}) { return `<form class="admin-product-form" id="admin-product-form"><div class="admin-form-grid">${productFields.map((field) => inputField(field, product)).join('')}</div><div class="admin-form-actions"><button type="button" class="button button-light" id="admin-cancel">Cancel</button><button class="button button-dark" type="submit">${product.id?'Save changes':'Add product'}</button></div></form>`; }
function productTable(products) { return `<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Product</th><th>SKU</th><th>Price</th><th>Category</th><th>Availability</th><th>Actions</th></tr></thead><tbody>${products.map(p=>`<tr><td><div class="admin-product-cell"><img src="${esc(p.image)}" alt=""/><span><b>${esc(p.name)}</b><small>${esc(p.id)}</small></span></div></td><td>${esc(p.sku)}</td><td>${formatPrice(p.price)}</td><td>${esc(p.category)}</td><td><span class="admin-stock ${p.stockStatus === 'out_of_stock' ? 'out' : 'in'}">${p.stockStatus === 'out_of_stock' ? 'Sold out' : 'In stock'}</span></td><td><button class="admin-edit" data-edit-product="${esc(p.id)}">Edit</button><button class="admin-delete" data-delete-product="${esc(p.id)}">Delete</button></td></tr>`).join('')}</tbody></table></div>`; }
function reviewForm(review = {}, products = []) { return `<form class="admin-product-form" id="admin-review-form"><div class="admin-form-grid"><label class="admin-field">Product *<select name="productId" required>${products.map(p=>`<option value="${esc(p.id)}" ${review.productId===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select></label><label class="admin-field">Reviewer name *<input name="name" required value="${esc(review.name||'')}"/></label><label class="admin-field">Date label<input name="date" value="${esc(review.date||'Just now')}"/></label><label class="admin-field">Rating *<input name="rating" type="number" min="1" max="5" step="1" required value="${esc(review.rating||5)}"/></label><label class="admin-field admin-field-wide">Review text *<textarea name="text" required>${esc(review.text||'')}</textarea></label></div><div class="admin-form-actions"><button type="button" class="button button-light" id="admin-review-cancel">Cancel</button><button class="button button-dark" type="submit">${review.id?'Save review':'Add review'}</button></div></form>`; }
function reviewTable(reviews, products) { return `<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Review</th><th>Product</th><th>Rating</th><th>Actions</th></tr></thead><tbody>${reviews.map(r=>`<tr><td><div class="review-cell"><b>${esc(r.name)}</b><small>${esc(r.date)} · ${esc(r.text)}</small></div></td><td>${esc(products.find(p=>p.id===r.productId)?.name||r.productId)}</td><td class="admin-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</td><td><button class="admin-edit" data-edit-review="${r.id}">Edit</button><button class="admin-delete" data-delete-review="${r.id}">Delete</button></td></tr>`).join('')}</tbody></table></div>`; }
export function adminPage() { return `<main class="admin-page"><div class="admin-topbar"><a href="/" data-link class="admin-brand"><img class="admin-logo-image" src="/assets/maqsood-logo.jpeg" alt="Maqsood Fans" /></a><span class="demo-badge">Demo admin · add your auth later</span></div><div class="admin-content"><div class="admin-intro"><span class="eyebrow">CATALOGUE WORKSPACE</span><h1>Admin panel</h1><p>Test the complete catalogue workflow: add products, edit details, manage reviews, and see changes reflected on the storefront.</p><div class="demo-warning">This is intentionally authentication-free for testing. Add your own authentication before putting this endpoint on a public subdomain.</div></div><div id="admin-root"><div class="admin-loading">Loading catalogue workspace…</div></div></div></main>`; }
export async function loadAdminPanel() { const root=document.querySelector('#admin-root'); if(!root)return; const [productsResponse,reviewsResponse]=await Promise.all([fetch('/api/admin/products'),fetch('/api/admin/reviews')]); if(!productsResponse.ok||!reviewsResponse.ok) throw new Error('Could not load admin data'); const [products,reviews]=await Promise.all([productsResponse.json(),reviewsResponse.json()]); root.innerHTML=`<div class="admin-toolbar"><div><b>${products.length} products · ${reviews.length} reviews</b><span>Live database demo workspace</span></div><div class="admin-toolbar-actions"><button class="button button-gold" id="admin-add">+ Add product</button><button class="button button-light" id="admin-add-review">+ Add review</button></div></div><div id="admin-editor"></div><h2 class="admin-section-title">Products</h2>${productTable(products)}<h2 class="admin-section-title">Customer reviews</h2><div id="admin-review-editor"></div>${reviewTable(reviews,products)}`; const editor=root.querySelector('#admin-editor'); root.querySelector('#admin-add').addEventListener('click',()=>{editor.innerHTML=productForm();bindProductForm(root,null);editor.scrollIntoView({behavior:'smooth',block:'start'});}); root.querySelectorAll('[data-edit-product]').forEach(b=>b.addEventListener('click',()=>{editor.innerHTML=productForm(products.find(p=>p.id===b.dataset.editProduct));bindProductForm(root,b.dataset.editProduct);editor.scrollIntoView({behavior:'smooth',block:'start'});})); root.querySelectorAll('[data-delete-product]').forEach(b=>b.addEventListener('click',async()=>{if(!confirm('Delete this product from the catalogue?'))return;const r=await fetch(`/api/admin/products/${b.dataset.deleteProduct}`,{method:'DELETE'});if(!r.ok)return alert('Could not delete product.');loadAdminPanel();})); const reviewEditor=root.querySelector('#admin-review-editor'); root.querySelector('#admin-add-review').addEventListener('click',()=>{reviewEditor.innerHTML=reviewForm({},products);bindReviewForm(root,null);reviewEditor.scrollIntoView({behavior:'smooth',block:'start'});}); root.querySelectorAll('[data-edit-review]').forEach(b=>b.addEventListener('click',()=>{reviewEditor.innerHTML=reviewForm(reviews.find(r=>String(r.id)===b.dataset.editReview),products);bindReviewForm(root,b.dataset.editReview);})); root.querySelectorAll('[data-delete-review]').forEach(b=>b.addEventListener('click',async()=>{if(!confirm('Delete this review?'))return;const r=await fetch(`/api/admin/reviews/${b.dataset.deleteReview}`,{method:'DELETE'});if(!r.ok)return alert('Could not delete review.');loadAdminPanel();})); }
function bindProductForm(root,editingId){
  root.querySelector('#admin-cancel').addEventListener('click',()=>{root.querySelector('#admin-editor').innerHTML='';});
  root.querySelectorAll('.admin-file-picker').forEach(picker=>{
    picker.addEventListener('change',e=>{
      const file=e.target.files?.[0];
      if(!file)return;
      const target=picker.dataset.target;
      const input=root.querySelector(`#input-${target}`);
      const thumb=root.querySelector(`#thumb-${target}`);
      if(thumb)thumb.innerHTML='<span style="font-size:8px">Loading…</span>';
      const reader=new FileReader();
      reader.onload=evt=>{
        const img=new Image();
        img.onload=()=>{
          const maxDim=1200;
          let w=img.width,h=img.height;
          if(w>maxDim||h>maxDim){
            if(w>h){h=Math.round((h*maxDim)/w);w=maxDim;}
            else{w=Math.round((w*maxDim)/h);h=maxDim;}
          }
          const canvas=document.createElement('canvas');
          canvas.width=w;canvas.height=h;
          const ctx=canvas.getContext('2d');
          ctx.drawImage(img,0,0,w,h);
          const dataUrl=canvas.toDataURL('image/jpeg',0.82);
          if(input)input.value=dataUrl;
          if(thumb)thumb.innerHTML=`<img src="${dataUrl}" alt="preview"/>`;
        };
        img.src=evt.target.result;
      };
      reader.readAsDataURL(file);
    });
  });
  root.querySelectorAll('.admin-field-image input[type="text"]').forEach(inp=>{
    inp.addEventListener('input',()=>{
      const key=inp.name;
      const thumb=root.querySelector(`#thumb-${key}`);
      if(thumb){
        const val=inp.value.trim();
        thumb.innerHTML=val?`<img src="${esc(val)}" alt="preview" onerror="this.parentElement.innerHTML='<span style=\\'font-size:8px;color:#c00\\'>Error</span>'"/>`:'<span>No image</span>';
      }
    });
  });
  root.querySelector('#admin-product-form').addEventListener('submit',async e=>{
    e.preventDefault();
    const data=Object.fromEntries(new FormData(e.currentTarget).entries());
    ['price','oldPrice','rating','reviews'].forEach(k=>data[k]=Number(data[k]));
    const r=await fetch(editingId?`/api/admin/products/${editingId}`:'/api/admin/products',{method:editingId?'PUT':'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});
    if(!r.ok)return alert('Could not save product.');
    window.location.reload();
  });
}
function bindReviewForm(root,editingId){root.querySelector('#admin-review-cancel').addEventListener('click',()=>{root.querySelector('#admin-review-editor').innerHTML='';});root.querySelector('#admin-review-form').addEventListener('submit',async e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget).entries());data.rating=Number(data.rating);const r=await fetch(editingId?`/api/admin/reviews/${editingId}`:'/api/admin/reviews',{method:editingId?'PUT':'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});if(!r.ok)return alert('Could not save review.');window.location.reload();});}
