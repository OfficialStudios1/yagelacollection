/* Loads active products from Supabase while keeping the supplied static catalog as fallback. */
(function(){
  const ok=window.supabase&&window.YAGELA_SUPABASE_URL&&window.YAGELA_SUPABASE_ANON_KEY&&!window.YAGELA_SUPABASE_URL.includes("YOUR-PROJECT")&&!window.YAGELA_SUPABASE_ANON_KEY.includes("YOUR_SUPABASE");
  if(!ok)return;
  const db=window.supabase.createClient(window.YAGELA_SUPABASE_URL,window.YAGELA_SUPABASE_ANON_KEY);
  const esc=v=>String(v??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  document.addEventListener("DOMContentLoaded",async()=>{
    const grid=document.getElementById("productGrid"); if(!grid)return;
    const {data,error}=await db.from("products").select("id,name,category,price,image_url,badge,description,active,sort_order").eq("active",true).order("sort_order").order("created_at",{ascending:false});
    if(error||!data?.length)return;
    grid.innerHTML=data.map(p=>`<div class="product-card" data-category="${esc(p.category)}" data-product-id="${esc(p.id)}"><div class="product-image"><img src="${esc(p.image_url||"assets/placeholder.jpg")}" alt="${esc(p.name)}" loading="lazy">${p.badge?`<span class="product-badge ${String(p.badge).toLowerCase()==="sale"?"sale":""}">${esc(p.badge)}</span>`:""}</div><div class="product-info"><span class="product-category">${esc(({personal:"Personal Care",home:"Household",fashion:"Fashion",ppe:"Engineering PPE",fragrance:"Fragrance",juice:"Fresh Juice"})[p.category]||p.category)}</span><h3>${esc(p.name)}</h3>${p.description?`<p class="small-text">${esc(p.description)}</p>`:""}<div class="product-price">GH₵ ${Number(p.price).toFixed(2)}</div><button class="add-cart" data-name="${esc(p.name)}" data-price="${Number(p.price)}" data-product-id="${esc(p.id)}"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button></div></div>`).join("");
    grid.addEventListener("click",e=>{
      const b=e.target.closest(".add-cart"); if(!b||b.dataset.handled)return; b.dataset.handled="1";
      let cart=JSON.parse(localStorage.getItem("yagelaCart")||"[]"), item=cart.find(x=>x.name===b.dataset.name);
      if(item)item.quantity++; else cart.push({name:b.dataset.name,price:Number(b.dataset.price),quantity:1,productId:b.dataset.productId});
      localStorage.setItem("yagelaCart",JSON.stringify(cart)); if(typeof window.updateCart==="function")window.updateCart();
      const cb=document.getElementById("cartButton"); if(cb)cb.click();
    });
  });
})();