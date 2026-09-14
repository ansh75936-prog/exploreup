/* ExploreUP district-services framework
 * Data policy: do not invent businesses, phone numbers, addresses, ratings or opening hours.
 * This layer only adds verified-source category labels and links; individual listings must be
 * populated from authoritative sources before being shown as factual listings.
 */
(function(){
  'use strict';
  const CATEGORIES = [
    ['Tourist Places','places'],['Hidden Gems','hidden-gems'],['Hotels & Stays','hotels'],
    ['Food & Restaurants','food'],['Theatres / Cinemas','theatres'],['Hospitals & Clinics','health'],
    ['Pharmacies','pharmacy'],['Transport','transport'],['Banks & ATMs','banking'],
    ['Markets & Shopping','shopping'],['Petrol Pumps / EV Charging','mobility'],
    ['Police & Emergency','emergency'],['Government Offices','government'],
    ['Schools & Colleges','education'],['Sports & Fitness','sports'],['Daily Services','daily-services'],
    ['Libraries','libraries']
  ];
  const VERIFIED_SOURCES = [
    {name:'UP Sewa Mitra',url:'https://sewamitra.up.gov.in/'},
    {name:'UP Medical & Health Services',url:'https://dgmh.up.gov.in/'},
    {name:'UP Public Library',url:'https://www.library.up.gov.in/'},
    {name:'UP District Profiles',url:'https://nri.up.gov.in/en/page/district-profiles'}
  ];
  window.ExploreUPDistrictServices={categories:CATEGORIES,verifiedSources:VERIFIED_SOURCES,policy:'verified-only'};
})();
