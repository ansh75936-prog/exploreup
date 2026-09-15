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
    d.Aligarh=[["Ramada by Wyndham Aligarh GT Road","Silverpark Residency Bhikampur, GT Road, Aligarh, Uttar Pradesh 202001","+91-571-2751000"],["Hotel Melrose Inn","Marris Road, Aligarh, Uttar Pradesh","+91-9927036668"],["Lemon Tree Hotel, Aligarh","Plot No: B/11, Marris Road, Opp. Pragati Vihar Colony, Aligarh, Uttar Pradesh 202001","+91 73007 60288"]];
    d.Amethi=[["Hotel Narendra Paradise","Near District Hospital, Asaidapur, Gauriganj, Amethi 227405","+91-8375052411"],["REVATI MAHAL","Showroom near Lodhi Baba, Raebareli Road, Gauriganj, Amethi, Uttar Pradesh 227813",""],["Kalyanam Hotel and Marriage Hall","Chowk-Madhavpur Road, near Santoshi Mata Mandir, Gauriganj, Amethi, Uttar Pradesh 227409",""]];
    d.Amroha=[["Hotel Parth","IDBI Bank building, Joya Road, Amroha, Uttar Pradesh 244221",""],["Sumagalam Hotal","SH-77, Subodh Nagar, Amroha, Uttar Pradesh 244221",""],["Gajraula Haveli Resort","Delhi Nanital Highway NH-24, Gajraula, District Amroha, Uttar Pradesh 244235",""]];
    d.Ayodhya=[["Hotel Saket","Near Ayodhya Railway Station, Ayodhya, Uttar Pradesh-224123","9451090074"],["Saryu Atithi Grah","Saryu Ghat, Near Ram Katha Park, Naya Ghat, Ayodhya, Uttar Pradesh-224123","9451090074"],["Taraji Resort Hotel & Restaurant","Deokali Bypass Road, Ayodhya","+91-7311160000"]];
    d.Balrampur=[["UPT Hotel","Bahraich Road, Balrampur",""],["Hotel Pathik","Veer Vinay Chauraha, Balrampur",""],["Hotel Maya","Near Stadium Ground, Balrampur",""]];
    d.Ballia=[["Hotel Park Inn","Ballia–Bansdih Rd, Mahavir Nagar, Parikhara, Uttar Pradesh 277001","+91-7499243000"],["Hotel Singhaal","In front of Bhrigu Mandir, Bhriguashram, Uttar Pradesh 277001","+91-05498-221099"],["Shankar Hotel","Chitbaragaon–Pipra Khurd, Near Indian Oil Petrol Pump, Chitbaragaon, Uttar Pradesh 221713","+91-8546000096, +91-9795610507"]];
    d.Bareilly=[["Rahi Hotel Rohila","2, Civil Lines, Near Gandhi Udyan, Bareilly, Uttar Pradesh-243001","9149099890"]];
    d.Bhadohi=[["Rahi Tourist Bungalow, Bhadohi","Gopiganj, Bhadohi, Uttar Pradesh","" ]];
    d.Budaun=[["Rahi Tourist Bungalow, Budaun","Civil Lines, Budaun, Uttar Pradesh-243601","9415608122"]];
    d.Chitrakoot=[["Rahi Tourist Bungalow","Near Poddar Inter College, Chitrakoot, Uttar Pradesh-210204","9415233445"]];
    d.Etawah=[["Rahi Tourist Bungalow, Sumer Singh Qila","Sumer Singh Qila, Etawah, Uttar Pradesh-206001","9415609450"]];
    d.Farrukhabad=[["Rahi Tourist Bungalow, Sankisa","Sankisa Tiraha, Opp. Sri Lanka Temple, Basantpur, Sankisa, Uttar Pradesh-209652","9415013045"]];
    d.Ghazipur=[["Rahi Tourist Bungalow, Ghazipur","NH-29, Chhavani Line, Varanasi Road, Ghazipur, Uttar Pradesh-233002","9415013039"]];
    d.Hapur=[["Rahi Tourist Bungalow, Garhmukteshwar","NH-24, Garhmukteswar Chauraha, Garhmukteshwar, Hapur, Uttar Pradesh-245205","8859096644"]];
    d.Hardoi=[["Treat Garden","Near DM Chauraha, Hardoi, Uttar Pradesh-241001",""],["Hotel Neelkanth, Hardoi","Canal Road, Hardoi, Uttar Pradesh-241001","9935772128"],["Hotel Utsav Hardoi","Circular Road, Hardoi, Uttar Pradesh-241001","9415006000"]];
    d.Jhansi=[["Rahi Veerangana Tourist Bungalow","Near Exhibition Ground (Atal Park), Civil Line, Jhansi, Uttar Pradesh-284003","9415609450"]];
    d.Kannauj=[["Rahi Tourist Bungalow","G.T. Road Makrand Nagar, Kannauj, Uttar Pradesh-209726","9415609450"]];
    d['Kanpur Dehat']=[["Rahi Tourist Bungalow, Rania","Etawah Road, Rania, Kanpur Dehat, Uttar Pradesh-209304","9415013040"]];
    d['Kanpur Nagar']=[["Rahi Tourist Bungalow, Bithoor","Nana Rao Peshwa Smarak Park, Bithoor, Kanpur, Uttar Pradesh-209203","9415609464"]];
    d.Kushinagar=[["Rahi Pathik Niwas","Buddha Marg, Kushinagar, Uttar Pradesh-274403","9415090074"]];
    d.Lucknow=[["Hotel Gomti","6, Tej Bahadur Sapru Marg, Near Sahara Ganj Mall, Hazratganj, Lucknow, Uttar Pradesh-226001","9453671319"]];
    d.Maharajganj=[["Rahi Tourist Bungalow, Sonauli","Sonauli, Maharajganj, Uttar Pradesh",""]];
    d.Mathura=[["Hotel Brijwasi Royal","State Bank Crossing, Station Road, Mathura, Uttar Pradesh-281001","0565-2401225"],["Hotel Wingston","Delhi Masani Bypass Road, Mathura, Uttar Pradesh-281003","9359530910"],["Hotel Madhuvan","Krishna Nagar, Mathura, Uttar Pradesh-201004","0565-2425256, 8859218769"]];
    d.Mau=[["Rahi Tourist Bungalow, DohriGhat","NH-29, Gontha Bazar, DohriGhat, Mau, Uttar Pradesh-275303","9415013039"]];
    d.Meerut=[["Hotel Crystal Palace","Jawahar Quarters, Jawahar Nagar, Meerut, Uttar Pradesh 250001","+91-9639111100"],["Hotel Samrat Heavens","Opposite Lokpriya Hospital, Garh Road, Meerut, Uttar Pradesh 250004","+91-9358827004"],["Hotel Bravura Resort","Delhi–Roorkee Bypass, Partapur, Meerut, Uttar Pradesh 250103","+91-8191900048"]];
    d.Mirzapur=[["Hotel Jahnavi","Near Shashtri Bridge, Mirzapur, Uttar Pradesh-231312","8004494476"],["Yatri Niwas, Vindhyachal","Partar Tiraha, Near Hanuman Mandir, Vindhyachal, Mirzapur, Uttar Pradesh-231307","8004494476"]];
    d.Moradabad=[["Rahi Tourist Bungalow","Near Circuit House Delhi Road, Moradabad, Uttar Pradesh-244001","9412155143"]];
    d.Prayagraj=[["Rahi Ilawart Tourist Bungalow","35, M.G. Marg Civil Line, Prayagraj, Uttar Pradesh-211001","8789773573"],["Rahi Triveni Darshan","Yamuna Bank Road, Kydganj, Prayagraj, Uttar Pradesh-211003","8789773573"]];
    d.Raebareli=[["Hotel Saras","Malikmau Crossing, Gol Chauraha, Raebareli, Uttar Pradesh-229001","9451090074"]];
    d.Shahjahanpur=[["Royal Panna Hotel","Shahjahanpur, Uttar Pradesh",""],["Satyam Hotel","Shahjahanpur, Uttar Pradesh",""],["Durga Hotel","Shahjahanpur, Uttar Pradesh",""]];
    d.Shravasti=[["Rahi Tourist Bungalow","Katra Shrawasti Marg, Shravasti, Uttar Pradesh-271805","9415013781"]];
    d.Sitapur=[["Rahi Tourist Bungalow, Neemsar","Neemsar, Sitapur, Uttar Pradesh",""]];
    d.Sonbhadra=[["New Hotel Savera","Civil Lines Road, Sonbhadra, Robertsganj, Uttar Pradesh 231216","05444 222 231"],["Hotel Shubh Shree Palace","Near Mission Hospital, 62, SH 5A, Tagore Nagar, Robertsganj, Uttar Pradesh 231216","094152 72411"],["Hotel Surya International","Near Mandi Samiti Pipri Road, Robertsganj, Uttar Pradesh 231216","086016 75655"]];
    d.Unnao=[["Rahi Tourist Bungalow, Nawabganj","Pakshi Vihar, Lucknow-Kanpur Road, Nawabganj, Unnao, Uttar Pradesh-209859","9149099890"]];
    d.Varanasi=[["Rahi Tourist Bungalow","Parade Kothi, Near Cantt. Railway Station, Varanasi, Uttar Pradesh-221002","9415902707"],["Rahi Tourist Bungalow Sarnath","Sarnath Station Road, Near Maha Bodhi Inter College, Sarnath, Uttar Pradesh-221007",""]];
    d.Jaunpur=[["Raghuwanshi Hotel","Jaunpur, Uttar Pradesh",""],["Siddharth Hotel","Jaunpur, Uttar Pradesh",""],["Hotel Riverview","Jaunpur, Uttar Pradesh",""]];
    d.Basti=[["Hotel Prakash","Tiwari Tola, Basti, Uttar Pradesh 272002","05542288301"],["Hotel Shivay Palace","Roadways Tiraha, Jaipuriya, Basti, Uttar Pradesh 272001","05542288999"],["Hotel Maharaja","Pikura Shiv Gulam, Malviya Road, Basti, Uttar Pradesh 272001","09825156150"]];
    d.Sultanpur=[["Hotel Vijay Delux","Lal Diggi Road, Civil Lines, Sultanpur, Uttar Pradesh 228001",""],["Hotel Vrindavan","Near Convent School, Civil Lines, Sultanpur, Uttar Pradesh 228001",""],["Garden View Hotel","Sirwara Road, Sultanpur, Uttar Pradesh 228001",""]];
    d.Fatehpur=[["Hotel A INN","371, Banda-Sagar Road, Harihar Ganj, Fatehpur, Uttar Pradesh 212601","05180-653200"],["Hotel Diplomat","State Highway 13, Near Road Ways Bus Stand Jawalaganj, Fatehpur, Uttar Pradesh 212601","05180-222786"],["Hotel Maya shayam","Bada sagar road, Plot No.400 near Mission Hospital, Harihar Ganj, Fatehpur, Uttar Pradesh 212601","05180-221466"]];
    d.Pilibhit=[["Hotel Moti Mahal","Benhur College Road, Pilibhit, Uttar Pradesh 262001","9412643295"],["Hotel Santosh","Moh. Nakhasa, Near Sungarhi Thana, Pilibhit, Uttar Pradesh 262001","8018091261"],["Hotel Nirmal","Chatri Chauraha, Pilibhit, Uttar Pradesh 262001","9927827777"]];
    d.Gonda=[["J.P Palace","Awas Vikas Colony, Infront of LIC Office, Gonda, Uttar Pradesh 271002","05262 225551"],["Sharma HOTELS","Gonda–Bahraich Rd, Civil Line, Azad Nagar, Gonda, Uttar Pradesh 271003","09555800800"],["Pathik Inn","Station Road, Gonda, Uttar Pradesh 271002","05262 222241"]];
    d.Auraiya=[["Vinayak Palace","Kanpur Road, Auraiya, Uttar Pradesh",""],["Kamla Lodge","Opposite Roadways Bus Stand, Auraiya, Uttar Pradesh",""],["Pradhan Hotel","AH 1, Brahm Nagar, Auraiya, Uttar Pradesh",""],["Sai Kirpa Lodge","Om Nagar, Auraiya, Uttar Pradesh",""]];
    window.__exploreUpVerifiedHotelOverridesApplied=true;
    if(typeof api.mount==='function') api.mount();
    return true;
  }catch(e){return false;}
}
if(apply()) return;
var tries=0,timer=setInterval(function(){if(apply()||++tries>40)clearInterval(timer)},100);
})();
