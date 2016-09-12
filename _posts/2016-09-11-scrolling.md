---
layout: post
title: Scrolling en Haxeflixel
tags:
  - Tutoriales Haxeflixel
---
En el [tutorial anterior]({{site.baseurl}}/tilemaps/) mostramos cómo mover un personaje animado a través de un tilemap. Cuando el mapa es más grande que la pantalla es necesario que la cámara siga al movimiento del personaje a medida que se desplaza por el escenario. En éste artículo mostraremos cómo hacerlo en Haxeflixel.

Éste forma parte de una serie de artículos sobre desarrollo de videojuegos en Haxeflixel. Aquí hay un índice de los artículos publicados hasta el momento:

<ul>
{% for post in site.posts reversed %}
  {% for tag in post.tags %}
    {% if tag == "Tutoriales Haxeflixel" %}
      {% if page.title != post.title %}
        <li><a href="{{site.baseurl}}{{post.url}}">{{ post.title }}</a></li>
      {% else %}
        <li>{{ post.title }} (éste artículo)</li>
      {% endif %}
    {% endif %}
  {% endfor %}
{% endfor %}
</ul>

El término *scrolling* se refiere al desplazamiento de la vista a través de una imagen o escena de mayor tamaño.

En Haxeflixel la clase [**FlxCamera**](http://api.haxeflixel.com/flixel/FlxCamera.html) sirve para representar y manipular una vista del juego. La cámara principal del juego puede ser accedida a través del atributo [*camera*](http://api.haxeflixel.com/flixel/FlxCamera.html) de la clase **FlxG**.

El método [*follow()*](http://api.haxeflixel.com/flixel/FlxCamera.html#follow) permite indicar cuál es el actor que la cámera debe seguir. Además del actor, el método recibe un segundo parámetro opcional que indica el algoritmo o estilo de scrolling a utilizar. Haxeflixel ofrece varios [estilos predefinidos de scrolling](http://api.haxeflixel.com/flixel/FlxCameraFollowStyle.html):

* **LOCKON**: es el estilo por defecto, la cámara no tiene zona muerta y sigue estrictamente el movimiento del objeto
* **PLATFORMER**: la cámara posee una zona muerta rectangular angosta y alta
* **TOPDOWN**: la cámara posee una zona muerta cuadrada de tamaño mediano
* **TOPDOWN_TIGHT**: la cámara posee una zona muerta cuadrada de tamaño pequeño
* **SCREEN_BY_SCREEN**: la cámara se moverá dando saltos del tamaño de la pantalla de manera similar a juegos como Megaman o Super Metroid

El movimiento excesivo de la cámara es algo que se desea evitar ya que puede marear al expectador.
La zona muerta (dead zone) es una región rectangular dentro de la cual el personaje puede moverse sin afectar el movimiento de la cámara. El efecto de los distintos tamaños de zona muerta para los estilos de scrolling mencionados arriba se puede observar en el [demo de cámara](http://haxeflixel.com/demos/FlxCamera/) de Haxeflixel.

En el código que se muestra a continuación se puede observar cómo se invoca al método *follow()* durante la creación de la escena para indicar que la cámara debe seguir al personaje.

<div class="code_container">
<pre name="code" class="brush: haxe; toolbar: false; gutter: false;">
class PlayState extends FlxState
{
        override public function create():Void
        {
                super.create();
                bgColor = 0xff849684;
                level = new FlxTilemap();
                var tiledMap = new TiledMap("assets/data/levels/level01.tmx");
                var layer = cast(tiledMap.getLayer("solid"), TiledTileLayer);
                level.loadMapFromArray(layer.tileArray, layer.width, layer.height, "assets/images/tiles_alpha.png", 16, 16, FlxTilemapAutoTiling.OFF, 1);
                char = new Character(64, 64);
                FlxG.camera.follow(char, FlxCameraFollowStyle.TOPDOWN);
                FlxG.camera.setScrollBoundsRect(0, 0, level.width, level.height, true);
                add(char);
                add(level);
        }
        ...
</pre>
</div>

Por lo general también es deseable indicar límites para que el movimiento de la cámara se detenga en los bordes de la escena y no se muestren regiones que estén fuera de la misma. Para ésto se puede utilizar el método [*setScrollBoundsRect()*](http://api.haxeflixel.com/flixel/FlxCamera.html#setScrollBoundsRect), que recibe como argumentos las coordenadas en *x* e *y* de los límites del movimiento. En el ejemplo mostrado se puede ver que se utiliza el tamaño del tilemap. Finalmente el último parámetro es muy importante, indica que debe actualizarse la región dentro de la cual se realiza el manejo de colisiones de acuerdo a dichos límites. Si el último parámetro de la llamada a no es *true* la cámara seguirá al objeto pero no se procesarán colisiones para objetos que se encuentren fuera de la vista inicial.

Debajo pueden observar el ejemplo en funcionamiento, y pueden descargar el código fuente [aquí](https://github.com/pabab/pvj2-fichunl-code/blob/master/_zip/scrolling.zip?raw=true).

{% include swf_example.html example_name="scrolling" modalid="1" %}
