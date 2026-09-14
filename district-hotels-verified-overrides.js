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
    d.Agra=[["ITC Mughal Hotel","Fatehabad Road, Agra",""],["Hotel Clarks Shiraz","Taj Road, Agra",""],["Radisson Blu Hotel","Agra",""]];
    d.Aligarh=[["Hotel Ramada by Wyndham","G.T. Road, Near Flyover, Aligarh","0571-2402222"],["Hotel Melrose Inn","Marris Road, Aligarh","0571-2400901"],["Lemon Tree Hotel, Aligarh","Plot No: B/11, Marris Road, Opp. Pragati Vihar Colony, Aligarh, Uttar Pradesh 202001","+91 73007 60288"]];
    d.Amethi=[["Hotel Narendra Paradise","Near District Hospital, Asaidapur, Gauriganj, Amethi 227405","+91-8375052411"],["REVATI MAHAL","Showroom near Lodhi Baba, Raebareli Road, Gauriganj, Amethi, Uttar Pradesh 227813",""],["Kalyanam Hotel and Marriage Hall","Chowk-Madhavpur Road, near Santoshi Mata Mandir, Gauriganj, Amethi, Uttar Pradesh 227409",""]];
    d.Amroha=[["Hotel Parth","IDBI Bank building, Joya Road, Amroha, Uttar Pradesh 244221",""],["Sumagalam Hotal","SH-77, Subodh Nagar, Amroha, Uttar Pradesh 244221",""],["Gajraula Haveli Resort","Delhi Nanital Highway NH-24, Gajraula, District Amroha, Uttar Pradesh 244235",""]];
    d.Ayodhya=[["Hotel Saket","Near Ayodhya Railway Station, Ayodhya, Uttar Pradesh-224123","9451090074"],["Saryu Atithi Grah","Saryu Ghat, Near Ram Katha Park, Naya Ghat, Ayodhya, Uttar Pradesh-224123","9451090074"],["Taraji Resort Hotel & Restaurant","Deokali Bypass Road, Ayodhya","+91-9450711111"]];
    d.Balrampur=[["UPT Hotel","Bahraich Road, Balrampur",""],["Hotel Pathik","Veer Vinay Chauraha, Balrampur",""],["Hotel Maya","Near Stadium Ground, Balrampur",""]];
    d.Ballia=[["Hotel Park Inn","Ballia–Bansdih Rd, Mahavir Nagar, Parikhara, Uttar Pradesh 277001","+91-7499243000"],["Hotel Singhaal","In front of Bhrigu Mandir, Bhriguashram, Uttar Pradesh 277001","+91-05498-221099"],["Shankar Hotel","Chitbaragaon–Pipra Khurd, Near Indian Oil Petrol Pump, Chitbaragaon, Uttar Pradesh 221713","+91-8546000096, +91-9795610507"]];
    d.Bareilly=[["Rahi Hotel Rohila","2, Civil Lines, Near Gandhi Udyan, Bareilly, Uttar Pradesh-243001","9149099890"]];
    d.Chitrakoot=[["Rahi Tourist Bungalow","Near Poddar Inter College, Chitrakoot, Uttar Pradesh-210204","9415233445"]];
    d.Jhansi=[["Rahi Veerangana Tourist Bungalow","Near Exhibition Ground (Atal Park), Civil Line, Jhansi, Uttar Pradesh-284003","9415609450"]];
    d.Kannauj=[["Rahi Tourist Bungalow","G.T. Road Makrand Nagar, Kannauj, Uttar Pradesh-209726","9415609450"]];
    d['Kanpur Dehat']=[["Rahi Tourist Bungalow, Rania","Etawah Road, Rania, Kanpur Dehat, Uttar Pradesh-209304","9415013040"]];
    d.Kushinagar=[["Rahi Pathik Niwas","Buddha Marg, Kushinagar, Uttar Pradesh-274403","9415090074"]];
    d.Lucknow=[["Hotel Gomti","6, Tej Bahadur Sapru Marg, Near Sahara Ganj Mall, Hazratganj, Lucknow, Uttar Pradesh-226001","9453671319"]];
    d.Mirzapur=[["Hotel Jahnavi","Near Shashtri Bridge, Mirzapur, Uttar Pradesh-231312","8004494476"],["Yatri Niwas, Vindhyachal","Partar Tiraha, Near Hanuman Mandir, Vindhyachal, Mirzapur, Uttar Pradesh-231307","8004494476"]];
    d.Moradabad=[["Rahi Tourist Bungalow","Near Circuit House Delhi Road, Moradabad, Uttar Pradesh-244001","9412155143"]];
    d.Prayagraj=[["Rahi Ilawart Tourist Bungalow","35, M.G. Marg Civil Line, Prayagraj, Uttar Pradesh-211001","8789773573"],["Rahi Triveni Darshan","Yamuna Bank Road, Kydganj, Prayagraj, Uttar Pradesh-211003","8789773573"]];
    d.Raebareli=[["Hotel Saras","Malikmau Crossing, Gol Chauraha, Raebareli, Uttar Pradesh-229001","9451090074"]];
    d.Shahjahanpur=[["Rahi Tourist Bungalow","Bank of Garra River, Shahjahanpur, Uttar Pradesh-242406","9415608122"]];
    d.Shravasti=[["Rahi Tourist Bungalow","Katra Shrawasti Marg, Shravasti, Uttar Pradesh-271805","9415013781"]];
    d.Varanasi=[["Rahi Tourist Bungalow","Parade Kothi, Near Cantt. Railway Station, Varanasi, Uttar Pradesh-221002","9415902707"],["Rahi Tourist Bungalow Sarnath","Sarnath, Varanasi, Uttar Pradesh",""],["BrijRama Palace","Darbhanga Ghat, Dashashwamedh, Varanasi","0542-2410222"]];
    window.__exploreUpVerifiedHotelOverridesApplied=true;
    if(typeof api.mount==='function') api.mount();
    return true;
  }catch(e){return false;}
}
if(apply()) return;
var tries=0,timer=setInterval(function(){if(apply()||++tries>40)clearInterval(timer)},100);
})();
