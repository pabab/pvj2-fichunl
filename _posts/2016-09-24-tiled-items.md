---
layout: post
title: Cargar items desde un archivo de nivel
tags:
  - Tutoriales Haxeflixel
  - Tiled
---

En el [artículo anterior]({{site.baseurl/groups-collisions/}}) mostramos cómo crear una escena con un personaje, un mapa, items y enemigos. Sin embargo, especificar la posición de cada elemento en el código no resulta práctico a la hora de diseñar los niveles del juego. En éste tutorial explicaremos algunas técnicas para agregar los elementos del juego directamente desde el editor de mapas.

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

Si bien la explicación de éste artículo estará centrada en el uso de Haxeflixel en conjunto con el editor Tiled, la idea es bastante sencilla y puede aprovecharse también con otros editores.

A pesar de que Tiled permite crear capas de objetos para los cuales se puede especificar propiedades arbitrarias, una solución mucho más sencilla para posicionar objetos en la escena, cuando se utilizan tilemaps, consiste en reservar tiles específicos para representara a determinados elementos del juego.

Éste procedimiento resulta sencillo y permite una edición rápida ya que los elementos se posicionan como si se tratase de un tile más. Además, se puede implementar con poco código. Por otro lado, tiene algunas desventajas como el hecho de que cada elemento deba colocarse en posiciones cuyas coordenadas resulten múltiplo del tamaño de los tiles (es decir, no puede haber posiciones intermedias) o que no puedan existir dos elementos en una misma posición (aunque ésto puede resolverse utilizando varias capas).

El siguiente muestra el uso de la técnica.

<iframe width="560" style="margin: 0 auto; display: block;" height="315" src="https://www.youtube.com/embed/B6_GJoWySEw" frameborder="0" allowfullscreen></iframe>


En resumen, el proceso consiste en lo siguiente:

1. Recorrer el tilemap y encontrar todos los tiles de un determinado tipo.
2. Para cada uno de esos tiles, calcular su posición dentro del mapa.
3. Crear el objeto correspondiente (enemigo, item, etc) en dicha posición.
4. Borrar el tile (en caso de que hayamos utilizado la misma capa para los items y para los tiles sólidos, ya que colisionaríamos con ellos)

El código para implementar dicho procedimiento se muestra a continuación.

<div class="code_container">
<pre name="code" class="brush: haxe; toolbar: false; gutter: false;">
...
level = new FlxTilemap();
var tiledMap = new TiledMap("assets/data/levels/level01.tmx");
var layer = cast(tiledMap.getLayer("solid"), TiledTileLayer);
level.loadMapFromArray(layer.tileArray, layer.width, layer.height, "assets/images/tiles_alpha.png", 16, 16, FlxTilemapAutoTiling.OFF, 1);
var tileWidth = Std.int(level.width/level.widthInTiles);
var tileHeight = Std.int(level.height/level.heightInTiles);

enemies = new FlxTypedGroup&lt;Enemy&gt;();
var tileInstances = level.getTileInstances(ENEMY_TILE);
  if(tileInstances != null){
    var x: Float;
    var y: Float;
    for(eTile in tileInstances){
      x = eTile % level.widthInTiles * tileWidth;
      y = Std.int(iTile/tilemap.widthInTiles) * tileHeight;
      var newEnemy = newEnemy(x, y);
      enemies.add(newEnemy);
      level.setTileByIndex(eTile, 0);
    }
  }
...
</pre>
</div>

En un tilemap, cada posición se puede especificar a través de un índice que indica su posición dentro del arreglo lineal que donde el mapa se almacena.

El método [*getTileInstances()*](http://api.haxeflixel.com/flixel/tile/FlxBaseTilemap.html#getTileInstances) permite obtener una lista con los índices de los tiles que tienen un determinado valor, en éste caso *ENEMY_TILE*. La función puede devolver **null** en caso de que no exista ningún tile con ese dentro del mapa.

En el código que se mostró, una vez que se obtuvo la lista con los índices de los tiles, se puede recorrerla y calcular la posición de cada uno de ellos para luego crear el objeto deseado en dicha posición y agregarlo al grupo.

Finalmente, en caso de que los tiles estén en la misma capa que se eligió como sólida (donde están los tiles del escenario), vamos a querer borrarlos para que el personaje no choque contra ellos. Eso se puede hacer con el método [*setTileByIndex()*](http://api.haxeflixel.com/flixel/tile/FlxBaseTilemap.html#setTileByIndex), el cual recibe el índice del tile que se desea modificar y su nuevo valor (el valor 0 indica que esa posición debe quedar vacía).

En el ejemplo que se muestra en el video, la escena del juego se reinicia para ver las modificaciones al tilemap. Ésto se puede lograr invocando al método [*resetState()*](http://api.haxeflixel.com/flixel/FlxG.html#resetState) como se muestra en el código de abajo.

<div class="code_container">
<pre name="code" class="brush: haxe; toolbar: false; gutter: false;">
if(FlxG.keys.justPressed.R)
{
  FlxG.resetState();
}
</pre>
</div>

El método *resetState()* destruye la escena actual y la reemplaza por una nueva instancia, obligando a que sea necesario volver a leer el los datos del tilemap desde disco.

Al realizar éste procedimiento de edición y prueba se debe prestar atención en editar el mapa del directorio *assets* que se encuentra dentro de la carpeta *export* correspondiente al ejecutable del juego, y no el de la carpeta *assets* del proyecto. De lo contrario los cambios no se verán reflejados en el juego.


## Una clase para ayudar con la carga de objetos

En un juego generalmente existe una gran cantidad de entidades, por lo cual es necesario repetir muchas veces el procedimiento explicado antes. Es por eso que resulta recomendable encapsular dicho procedimiento dentro de una función que facilite su reutilización y ayude a mantener el código ordenado.

En ésta sección se presenta una clase propia para ayudar a la carga de entidades desde un tilemap.

La clase permite facilitar la creación de objetos de distintas clases e incluso permite utilizar distintos tiles para representar múltiples configuraciones de un mismo objeto. En el código que figura debajo se muestra el uso de las funciones, las cuales forman parte de la clase **TilemapHelper** incluida en el ejemplo.

<div class="code_container">
<pre name="code" class="brush: haxe; toolbar: false; gutter: false;">
char = TilemapHelper.createSingleObjectFromTile(level, [CHAR_TILE], Character, ["x", "y"]);
enemies = TilemapHelper.createGroupFromTiles(level, [ENEMY_TILE], Enemy, ["x", "y"]);
coins = TilemapHelper.createGroupFromTiles(level, [COIN_TILE], Coin, ["x", "y"]);
</pre>
</div>

La función *createSingleObjectFromTile()* devuelve un grupo tipado de objetos creados a partir de los tiles con el valor especificado. Recibe como parámetros: el tilemap, un arreglo con los valores de tiles en los que hay que crear un elemento, la clase del elemento que se desea crear (y por consiguiente también del grupo) y un arreglo con los parámetros de que serán pasados al constructor del objeto. En el arreglo de parámetros al constructor, las cadenas de texto *"x"* e *"y"* serán reemplazadas por las coordenadas del tile. También puede utilizarse la cadena *"tile"* que será reemplazada por el valor del tile. Como se mencionó anteriormente, la función puede recibir varios valores de tiles, teniendo en cuenta que se utilizaron distintos valores de tiles para crear objetos de una misma clase (por ejemplo, el mismo enemigo pero de distinto color), por lo cual el valor del tile también puede ser pasado al constructor.

La función *createSingleObjectFromTile()* funciona exactamente igual que la anterior, sólo que devuelve un único objeto en lugar de un grupo. Resulta útiles para entidades de las cuales existe una sola instancia como, por ejemplo, el personaje principal.

Se puede descargar el código completo del ejemplo desde [aquí](http://github.com/pabab/pvj2-fichunl-code/blob/master/_zip/tiled_items.zip?raw=true).

<script>
  $(document).ready(function(){
    SyntaxHighlighter.all()
  });
</script>
