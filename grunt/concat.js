module.exports = {
  angular:{
    src:[
      'public/libs/jquery/jquery/dist/jquery.js',

      'public/libs/angular/angular/angular.js',     
      'public/libs/angular/angular-animate/angular-animate.js',
      'public/libs/angular/angular-aria/angular-aria.js',
      'public/libs/angular/angular-cookies/angular-cookies.js',
      'public/libs/angular/angular-messages/angular-messages.js',
      'public/libs/angular/angular-resource/angular-resource.js',
      'public/libs/angular/angular-sanitize/angular-sanitize.js',
      'public/libs/angular/angular-touch/angular-touch.js',
      'public/libs/angular/angularjs-toaster/toaster.js',
      'public/libs/angular/angular-material/angular-material.js',
      'public/libs/angular/angular-ui-router/release/angular-ui-router.js', 
      'public/libs/angular/ngstorage/ngStorage.js',
      'public/libs/angular/angular-ui-utils/ui-utils.js',
      'public/libs/angular/angular-bootstrap/ui-bootstrap-tpls.js',
      'public/libs/angular/oclazyload/dist/ocLazyLoad.js',
      
      'public/libs/angular/angular-translate/angular-translate.js',
      'public/libs/angular/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'public/libs/angular/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
      'public/libs/angular/angular-translate-storage-local/angular-translate-storage-local.js',

      'public/js/*.js',
      'public/js/directives/*.js',
      'public/js/services/*.js',
      'public/js/filters/*.js',
      'public/js/controllers/bootstrap.js'
    ],
    dest:'public/js/app.src.js'
  }
}
