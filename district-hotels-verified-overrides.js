/* ExploreUP verified hotel replacements.
 * Only records independently matched to reliable online sources are placed here.
 * Blank phone fields are intentional when the source did not publish a phone number.
 */
(function(){
'use strict';
function apply(){
  try{
    var api=window.ExploreUPHotels;
    if(!api || !api.data) return false;
    var d=api.data;

    /* Aligarh: replace the previously unconfirmed Hotel Classik. */
    if(d.Aligarh) d.Aligarh[2]=["Lemon Tree Hotel, Aligarh","Plot No: B/11, Marris Road, Opp. Pragati Vihar Colony, Aligarh, Uttar Pradesh 202001","+91 73007 60288"];

    /* Amethi: replace previously unconfirmed entries with properties found online. */
    d.Amethi=[
      ["Hotel Narendra Paradise","Near District Hospital, Asaidapur, Gauriganj, Amethi 227405","+91-8375052411"],
      ["REVATI MAHAL","Showroom near Lodhi Baba, Raebareli Road, Gauriganj, Amethi, Uttar Pradesh 227813",""],
      ["Kalyanam Hotel and Marriage Hall","Chowk-Madhavpur Road, near Santoshi Mata Mandir, Gauriganj, Amethi, Uttar Pradesh 227409",""]
    ];

    /* Amroha: replace previously unconfirmed entries with the current district-administration list. */
    d.Amroha=[
      ["Hotel Parth","IDBI Bank building, Joya Road, Amroha, Uttar Pradesh 244221",""],
      ["Sumagalam Hotal","SH-77, Subodh Nagar, Amroha, Uttar Pradesh 244221",""],
      ["Gajraula Haveli Resort","Delhi Nanital Highway NH-24, Gajraula, District Amroha, Uttar Pradesh 244235",""]
    ];

    window.__exploreUpVerifiedHotelOverridesApplied=true;
    if(typeof api.mount==='function') api.mount();
    return true;
  }catch(e){return false;}
}
if(apply()) return;
var tries=0, timer=setInterval(function(){if(apply()||++tries>40)clearInterval(timer)},100);
})();
