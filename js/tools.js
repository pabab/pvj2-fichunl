/*
 * Creates a photo carousel, must be called with the element id as string.
 * ie: createPhotoGallery("myGalleryDiv")
 * The img elements mus be inside
 */
function createPhotoGallery(elemIdStr, autoPlayTime = 3000){
  var $gallery = $(elemIdStr);
  var $photos = $(elemIdStr+" img");
  var currentPhoto = 0;

  $gallery.addClass("photo-gallery");
  $gallery.append('<footer></footer>')
  $footer = $(elemIdStr+" footer")
  for(var i = 0; i<$photos.length; i++){
    $footer.append('<div class="selector" onclick="cancelTimer(); goto('+i+');">&nbsp</div>')
  }

  var $selectors = $(elemIdStr+" footer .selector");
  updateShownPhoto=function(){
    for(var i = 0; i<$photos.length; i++){
      if(i == currentPhoto){
        $selectors[i].className = "selector current";
        $photos[i].className = "img_gallery_shown";
      }else{
        $selectors[i].className = "selector normal";
        $photos[i].className = "img_gallery_hidden";
      }
    }
  }

  next = function(){
    currentPhoto = (currentPhoto + 1)%$photos.length;
    updateShownPhoto();
  }

  prev = function(){
    currentPhoto = (currentPhoto - 1);
    if (currentPhoto < 0) currentPhoto = $photos.length - 1;
    updateShownPhoto();
  }

  goto = function(i){
    currentPhoto = i;
    updateShownPhoto();
  }

  cancelTimer = function(){
    if(timer !== null){
      clearTimeout(timer);
      timer = null;
    }
  }

  goto(0);

  var timer = null;
  if(autoPlayTime !== 0){
    timedNext = function(){
      if(timer != null){
        next();
        timer = setTimeout(timedNext, autoPlayTime);
      }
    }
    timer = setTimeout(timedNext, autoPlayTime);
  }
}


function showModalExample(exampleName){
  $("#mm_modal").modal();

}


function CodeHelper(){
  var elems = [];

  this.add = function(codeUrl, elemId){
    elems.push({url: codeUrl, elemId: elemId, loaded: false});
  }

  var allLoaded = function(){
    for(var i = 0; i<elems.length; i++){
      if(!elems[i].loaded) return false;
    }
    return true;
  }

  this.go = function(finishCallback){
    elems.forEach(function(item, index){
      $.get(item.url, function(data, status){
        $(item.elemId).text(data);
        elems[index].loaded = true;
        if(allLoaded()) finishCallback();
      })
    });
  }
}
