---
layout: post
title: Grupos y manejo de colisiones
tags:
  - Tutoriales Haxeflixel
---

En este artículo explicaremos cómo agrupar actores en Haxeflixel y cómo utilizar los grupos creados para facilitar la detección y el manejo de colisiones.

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

Un grupo es un actor especial que puede contener a otros actores. Los grupos resultan muy útiles para organizar la escena, simplificar el manejo de colisiones y utilizar de manera más eficiente la memoria.

Los actores se pueden agregar a un grupo de la misma manera que a una escena. Y el grupo, a su vez, puede ser agregado a la escena igual que cualquier otro actor. Incluso es posible agregar grupos dentro de otros grupos, formando de esta manera un árbol de actores.

## FlxGroup y FlxTypedGroup

Para representar grupos existen las clases [**FlxTypedGroup**](http://api.haxeflixel.com/flixel/group/FlxTypedGroup.html) y [**FlxGroup**](http://api.haxeflixel.com/flixel/group/FlxGroup.html). Los primeros pueden contener únicamente objetos de un mismo tipo especificado en el momento de su creación. Los grupos del segundo tipo pueden contener cualquier objeto que pueda agregarse a la escena (es decir, objetos de cualquier clase que descienda de [**FlxBasic**](http://api.haxeflixel.com/flixel/FlxBasic.html)). Mientras que los primeros resultan más eficientes y menos propensos a errores, los segundos son más flexibles.

En el fragmento de código que aparece abajo se pueden ver los atributos y el método *create()* de una escena que contiene algunos enemigos, representados por la clase **Enemy**, y algunos items representados por la clase **Coin**.

Como atributos de la escena se han declarado dos grupos tipados: uno para almacenar todos los items y otro para los enemigos. Luego de crear los grupos con *new*, se crean y agregan a los mismos algunos objetos del tipo correspondiente. Finalmente los grupos se agregan a la escena junto con el personaje y el nivel. Ésto significa que cuando la escena se actualice también se actualizarán los grupos y, por consiguiente, todos los elementos contenidos en los mismos.

<div class="code_container">
<pre name="code" class="brush: haxe; toolbar: false; gutter: false;">
class PlayState extends FlxState
{
  override public function create():Void
  {
    super.create();
    ...
    char = new Character(64, 64);
    enemies = new FlxTypedGroup&lt;Enemy&gt;();
    coins = new FlxTypedGroup&lt;Coin&gt;();
    characterCollideables = new FlxGroup();

    coins.add(new Coin(160, 64));
    coins.add(new Coin(160, 80));
    coins.add(new Coin(160, 96));

    enemies.add(new Enemy(256, 176));
    enemies.add(new Enemy(240, 48));
    enemies.add(new Enemy(160, 112));

    add(level);
    add(coins);
    add(enemies);
    add(char);
    characterCollideables.add(enemies);
    characterCollideables.add(level);
    characterCollideables.add(coins);
  }

  ...

  private var char: Character;
  private var level: FlxTilemap;
  private var enemies: FlxTypedGroup&lt;Enemy&gt;;
  private var coins: FlxTypedGroup&lt;Coin&gt;;
  private var characterCollideables: FlxGroup;
}
</pre>
</div>

En el ejemplo, también se ha creado un grupo sin tipo específico llamado *characterCollideables* que va a contener todos los objetos que pueden colisionar con el personaje: enemigos, items y el nivel. Al tratarse de un grupo no tipado puede contener elementos de distintas clases (incluso otros grupos). Se debe notar que éste grupo no es agregado a la escena ya que todos sus elementos han sido agregados a la escena anteriormente, sin embargo será utilizado más adelante para comprobar si existen colisiones entre todos esos elementos y el personaje.


## Manejo de colisiones usando grupos

Para detectar solapamiento entre objetos se puede utilizar el metodo [*overlap()*](http://api.haxeflixel.com/flixel/FlxG.html#overlap), similar a *collide()* presentado anteriormente. El método overlap recibe dos objetos o grupos de objetos e invoca a un callback por cada objeto del primer grupo que se solape con uno del segundo.

En el código debajo se muestra el método *update()* correspondiente a la escena. Durante cada actualización se invoca a *overlap()* pasando como argumentos el grupo *characterCollideables* y el personaje, el tercer parámetro es el callback *onCollisionWithChar()* cuyo código también se muestra debajo. El callback *onCollisionWithChar()* será invocado por cada objeto del grupo *characterCollideables* (**no con los grupos, sino con los objetos dentro de ellos**) que entre en contacto con el personaje.

<div class="code_container">
<pre name="code" class="brush: haxe; toolbar: false; gutter: false;">
override public function update(elapsed:Float):Void
{
  super.update(elapsed);
  FlxG.overlap(characterCollideables, char, onCollisionWithChar);
  FlxG.collide(level, enemies);
}

private function onCollisionWithChar(theObject: FlxObject, theChar: Character)
{
  if(theObject == level)
  {
    FlxObject.separate(theObject, theChar);
  }
  else if(Type.getClass(theObject) == Enemy)
  {
    theChar.hit();
  }
  else if(Type.getClass(theObject) == Coin){
    var theCoin = cast(theObject, Coin);
    theCoin.pick();
  }
}
</pre>
</div>

El callback llamado por *overlap()* recibe como argumentos dos objetos compatibles con **FlxBasic**. En éste caso, ya que invocamos a *overlap()* pasando como primer argumento el grupo *characterCollideables* y como segundo al personaje, sabemos que *onCollisionWithChar()* recibirá, a su vez, algún objeto del grupo como primer argumento y al personaje como segundo. Ya que el segundo argumento será siempre el personaje, se especificó a **Character** como su tipo para evitar la necesidad de una conversión.

Por otro lado, dado que el primer argumento de *onCollisionWithChar()* puede en realidad ser distintas cosas (el nivel, un enemigo o un item), es necesario averiguar su tipo para realizar las acciones acordes. Ésto puede comprobarse usando el método [*getClass()*](http://api.haxeflixel.com/Type.html#getClass) de la clase [**Type**](http://api.haxeflixel.com/Type.html).

En el caso de que la colisión del personaje sea con el tilemap, dado que sólo existe uno de ellos en la escena, es posible preguntar si el primer argumento del callback y el atributo *level* corresponden al mismo objeto. En caso afirmativo, se puede separar al personaje del nivel invocando a [separate()](http://api.haxeflixel.com/flixel/FlxObject.html#separate) de **FlxObject** (es el mismo método invocado por *collide()* cuando detecta solapamiento).

Si el primer objeto del callback es uno de los enemigos, invocamos al método *hit()* del personaje para que reciba daño.

Finalmente, si el objeto es una moneda se se debe invocar al método *pick()* para juntarla. Pero ya que dicho método fue definido en la clase **Coin** y el tipo de la variable *theObject* es **FlxObject** es necesario realizar una conversión de tipo (cast) para obtener una referencia de tipo **Coin** que permita invocar a *pick()*.

Debajo pueden apreciar el ejemplo funcionando. Pueden descargar el código fuente del ejemplo [aquí](http://github.com/pabab/pvj2-fichunl-code/blob/master/_zip/group_collisions.zip?raw=true).

{% include swf_example.html example_name="group_collisions" modalid="1" %}

## ¿Cómo funciona *overlap()*?

La detección de colisiones en Haxeflixel se realiza mediante [quadtrees](https://en.wikipedia.org/wiki/Quadtree). Cada vez que se invoca a *overlap()* o *collide()* todos los elementos del primer grupo se cargan en un quadtree y todos los elementos del segundo en otro. Luego se recorre simultáneamente ambos quadtrees y se comprueban las colisiones de los elementos que se encuentren en las mismas regiones.

Al agrupar objetos se debe hacerlo buscando minimizar la cantidad de llamadas a *overlap()* o *collide()*.

## Ajustando los AABB

Haxeflixel utiliza AABB como figura de colisión para todos sus objetos. Por defecto, el tamaño del AABB es el mismo de la imagen elegida para el sprite. Ésto, sin embargo, no siempre conviene ya que las imagenes suelen contener mucho espacio transparente, por lo que se desea una caja de colisión más ajustada.

El tamaño de la caja de colisión puede modificarse mediante los atributos *width* y *height* de cualquier objeto. Al hacerlo, se debe tener en cuenta que el origen de la imagen elegida para el sprite siempre se corresponderá con el origen del AABB, por lo cual será necesario aplicarle un desplazamiento a la imagen para lograr que ésta se visualice correctamente. Dicho desplazamiento se puede ajustar mediante el atributo *offset*.

Debajo se puede ver el código del constructor del la clase **Coin**, en elque se utilizan los atributos mecionados antes para ajustar el AABB de los objetos de ese tipo.

<div class="code_container">
<pre name="code" class="brush: haxe; toolbar: false; gutter: false;">
class Coin extends FlxSprite
{
  public function new (X: Float = 0, Y: Float = 0)
  {
    super(X, Y);
    loadGraphic("assets/images/sCoins.png", true, 16, 16);
    animation.add("idle", [0, 1, 2, 3], 3);
    animation.play("idle");
    width = 6;
    offset.x = 5;
    height = 8;
    offset.y = 8;
  }
  ...
</pre>
</div>

Haxeflixel posee un [depurador visual incorporado](http://coinflipstudios.com/devblog/?p=134) que resulta muy útil, entre otras cosas, para visualizar los AABB de los objetos. Éste depurador puede ser de gran ayuda a la hora de ajustar las cajas de colisión de los objetos.

Para habilitar el depurador es necesario agregar la siguiente línea dentro del archivo *Project.xml*.

<div class="console">
  &lt;set name="debug"&gt;
</div>

Una vez dentro del juego, activar la interfaz de depuración mediante la tecla  "~" (tilde). También es posible mostrarlo desde el código con la siguiente setencia.

<div class="code_container">
<pre name="code" class="brush: haxe; toolbar: false; gutter: false;">
FlxG.debugger.visible = true;
</pre>
</div>

Debajo se puede ver una captura de pantalla de los AABBs del personaje y los items antes y después de ser ajustados.

<td><img src="{{site.baseurl}}/images/aabb_debugger.png" style="width: 90%; margin: 0 auto; display: block; "></td>


<script>
  $(document).ready(function(){
    SyntaxHighlighter.all()
  });
</script>
