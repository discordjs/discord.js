$(document).ready(function() {

  $('.full').removeClass('hidden');
  $('.sidenav').sidenav();
  $('.tabs').tabs();
  
  new fullpage('.fullpage', {
    licenseKey: "OPEN-SOURCE-GPLV3-LICENSE",
    navigation: true,
    loopBottom: true,
    sectionsColor: ['transparent', '#fff', '#111']
  });

});