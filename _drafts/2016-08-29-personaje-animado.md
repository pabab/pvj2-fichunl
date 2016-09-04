---
layout: post
title: Creando un personaje animado
tags:
  - Tutoriales Haxeflixel
---

En tutoriales anteriores aprendimos [cómo agregar un sprite a la escena]({{site.baseurl}}/haxeflixel-primer-proyecto/) y [moverlo con el teclado]({{site.baseurl}}/movimiento-sprite/). En éste tutorial mostraremos cómo crear un personaje animado utilizando spritesheets.

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


## La clase Personaje

A medida que nuestros personajes o entidades empiezan a hacerse más complejos deja de ser práctico mantener su código dentro de la escena y resulta mejor moverlo a una nueva clase específica. Para crear una nueva clase para nuestro personaje podemos heredar de **FlxSprite** y redefinir algunos de sus métodos de la misma manera que con las escenas. Ya que la nueva clase heredará las funcionalidades de **FlxSprite**, será posible darle el mismo tratamiento y agregarlo a la escena como si se tratase de un sprite común. Debajo se muestra el código de una escena a la que se agrega un personaje representado por la clase **Character**.

<div class="code_container">
<pre name="code" class="brush: haxe; toolbar: false; gutter: false;">
class PlayState extends FlxState
{
  private var character: Character;

  override public function create():Void
  {
    super.create();
    character = new Character(160, 160);
    add(character);
  }

  override public function update(elapsed: Float):Void
  {
    super.update(elapsed);
  }
}
</pre>
</div>

La estructura mínima para una clase que representa a un personaje se puede ver en el código de abajo. En Haxe, cada clase debe definirse en un archivo que tenga su mismo nombre. El constructor es siempre la función que lleva el nombre *new()*. Dicha función no tiene tipo de retorno y puede recibir los parámetros que sean necesarios, en este caso son las coordenadas iniciales del personaje. Desde el constructor, se debe siempre invocar al constructor de la clase padre (**FlxSprite**) utilizando la palabra reservada *super* y proporcionando los parámetros necesarios.


<div class="code_container">
<pre name="code" class="brush: haxe; toolbar: false; gutter: false;">
class Character extends FlxSprite
{
  public function new(X: Float, Y: Float)
  {
    super(X, Y, "assets/images/logo.png");
  }

  public override function update(elapsed: Float):Void
  {
    super.update(elapsed);
  }
}
</pre>
</div>

En el código de la clase del personaje se puede notar que también se sobreescribe el método *update()*. Como habíamos comentado antes, el comportamiento por defecto del método *update()* de la escena es recorrer los actores que fueron agregados a la misma e invocar a *update()* para cada uno de ellos (notar que el método *update()* está definido tanto en la clase **FlxState** como en **FlxSprite**).

Sabiendo ésto, podemos escribir la lógica del comportamiento del personaje dentro de los métodos de su propia clase, en lugar de los pertenecientes a la escena, para mantener el codigo más ordenado.

En el ejemplo anterior, los métodos *update()*, tanto del personaje como de la escena, permancen con su comportamiento por defecto. A continuación veremos qué modificaciones hacen falta en la clase del personaje para agregarle animaciones.


## Spritesheets y animaciones

Un *Sprite Sheet* (a veces también conocido como Atlas de Textura) es una imagen que contienen un conjunto de imágenes más pequeñas (generalmente con las poses del personaje) empacadas en su interior como la que se observa debajo. Ésta técnica comenzó a utilizarse con el surgimiento de las primeras consolas de videojuegos para realizar un mejor aprovechamiento de los recursos, ya que permite [aprovechar mejor la memoria de video](http://player.vimeo.com/video/44440528) y [acelerar el dibujado](http://player.vimeo.com/video/55557803).

<img style="display: block; margin: 0 auto;" src="{{site.baseurl}}/images/spritesheet_char.png" />

Los sprites de Haxeflixel permiten trabajar con éste tipo de imágenes y agregar animaciones a partir de los cuadros contenidos en las mismas. Para cargar un sprite sheet, en lugar de especificar la imagen del sprite al llamar a su constructor, se debe hacerlo luego invocando al método [*loadGraphic()*](http://api.haxeflixel.com/flixel/FlxSprite.html#loadGraphic), el cual permite cargar una imagen especificando parámetros avanzados.

Al llamar a *loadGraphic()*, además del nombre del archivo de imagen a utilizar, se debe especificar un valor booleano como segundo parámetro (true en este caso) indicando que se desea crear animaciones con el spritesheet que se cargará. También se debe indicar las dimensiones de los frames o cuadros del spritesheet (todas los cuadros del sprite sheet deberían tener el mismo tamaño).

Una vez que se haya cargado el sprite sheet, se podrá utilizar el atributo [*animation*](http://api.haxeflixel.com/flixel/animation/FlxAnimationController.html) del sprite para crear y reproducir animaciones como se muestra en el ejemplo de abajo.

<div class="code_container">
<pre name="code" class="brush: haxe; toolbar: false; gutter: false;" id="example_character">
</pre>
</div>

El método [*add()*](http://api.haxeflixel.com/flixel/animation/FlxAnimationController.html#add) del atributo *animation* permite crear una nueva animación para el sprite especificando un nombre para la misma, un arreglo con los cuadros que lo componen, un entero que especifica la velocidad de reproducción de la animación en cantidad de cuadros por segundo y finalmente un valor de verdad que indica si la animación debe o no repetirse una vez que haya finalizado.

Una vez se hayan agregado las animaciones al personaje se puede indicar, mediante el método *play()*, cuál se desea reproducir.

Finalmente, para que el personaje se anime correctamente, será necesario espejar la imagen horizontalmente según el se mueva en uno u otro sentido. Para esto se utiliza el atributo *flipX* de la clase **FlxSprite**.

Debajo puede apreciarse el ejemplo en funcionamiento.

{% include swf_example.html example_name="animated_character" modalid="1" %}

## Conclusión

En artículo explicamos cómo crear una nueva clase para el personaje principal y separar así su código ded de la escena. Además, mostramos cómo cargar un sprite sheet y utilizarlo para animar un sprite.

En el ejemplo, el manejo de entrada (lectura del estado del teclado) se realiza dentro del método *update()* de la clase del sprite y no de la escena. Si bien muchos recomiendan que el manejo de entrada se realice de manera unificada (es decir, todo desde una misma función), otro enfoque cómodo y que también brinda cierta prolijidad es que cada entidad gestione su propia entrada dentro de su clase, dejando así el método *update()* de la escena para codificar allí las reglas de la mecánica del juego.

En los próximos tutoriales aprenderemos a crear otras entidades con las que el personaje pueda interactuar, como un items y un nivel.

<script type="text/javascript">

  $.get("https://raw.githubusercontent.com/pabab/pvj2-fichunl-code/master/animated_character/source/Character.hx", function(data, status){
    $('#example_character').text(data);
    SyntaxHighlighter.all()
  })
</script>
