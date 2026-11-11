let aryaLiveCache=null, aryaLiveCacheAt=0, aryaLivePromise=null;
async function getAryaLiveContext(){
 const now=Date.now();
 if(aryaLiveCache && now-aryaLiveCacheAt<60000)return aryaLiveCache;
 if(aryaLivePromise)return aryaLivePromise;
 aryaLivePromise=(async()=>{
  try{
   if(!exploreSupabase)return {districts:[],suggestions:[],reviews:[]};
   const [d,s,r]=await Promise.all([
    exploreSupabase.from('districts').select('name,name_hi,slug,kind').eq('is_active',true).order('sort_order',{ascending:true}),
    exploreSupabase.from('suggestions').select('district_slug,category,message').eq('status','approved').order('created_at',{ascending:false}).limit(20),
    exploreSupabase.from('reviews').select('district_slug,rating,review_text').eq('status','approved').order('created_at',{ascending:false}).limit(20)
   ]);
   aryaLiveCache={districts:d.data||[],suggestions:s.data||[],reviews:r.data||[]};
   aryaLiveCacheAt=Date.now();
   return aryaLiveCache;
  }catch(e){return aryaLiveCache||{districts:[],suggestions:[],reviews:[]};}
  finally{aryaLivePromise=null;}
 })();
 return aryaLivePromise;
}
