---
layout: post
title: Creando un personaje animado
tags:
  - Tutoriales Haxeflixel
---

En tutoriales anteriores aprendimos ???? , en éste tutorial aprenderemos a crear un personaje animado, agregarle animación mediante spritesheets. Y ordenar mejor el código creando organizando el código de nuestro personaje en su propia clase.

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


## La clase personaje

Ahora que el c´odigo de nuestro personaje o entidad se empieza a hacer más complejo. No queda bien que todo el código del manejo del mismo quede en la escena. Para crear una nueva clase para nuestro personaje, podemos crear una clase que herede de **FlxSprite** y redefinir su propio comportamiento o agregar nuestra propia lógica. Ya que nuestra clase va a heredar de FlxSprite, vamos a poder darle el mismo tratamiento desde la escena y agregarlo como si se tratara de un sprite común. Entonces, el código de una escena quedaría similar al que se muestra debajo.

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

En el código de abajo vemos la clase Character que representa un personaje. Como comentamos antes, la clase hereda de FlxSprite. La clase siempre se debe definir en un archivo que tenga su mismo nombre para poder importarla correctamente desde otro lado.
El cosntructor es la función que se define con el nombre new(), no tiene tipo de retorno y puede tener los parámetros que nosostros queramos. En este caso solo hemos recibido las coordenadas iniciales de nuestro personaje. Desde el constructor, podemos invocar al constructor de la clase padre (FlxSprite) utilizando la palabra reservada super y facilitando los parámetros necesarios para la inicialización.


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
</pre>
</div>


Notamos que la clase de nuestro personaje (que recordemos hereda de FlxSprite) también sobreescribe el método update(). Como se comentó anteriormente, el comportamiento por defecto de update() en la escena es invocar a update() en todos los elementos hijos (agregados). Al agregar a nuestro personaje a la escena, la misma invocará a update() en cada update suyo. Es por eso que podremos agregar en el update de nuestro personaje la logica del comportamiento propio del mismo.


Generalmente es buena idea que el update() de la escena se cdifiquen las reglas de la mecanica del juego y que las acciones especificas del personaje queden dentro de su propia clase.

Notar que en el método update de la escena no estamos haciendo nada. Esto es porque vamos a poner el código de la lógica de movimiento del personaje dentro de la clase character. 

A continuación veremos que agregar dentro del constructor y update() de nuestro personaje para crear un personaje animado.


## Spritesheets y animaciones

Un SpriteSheet (a veces también conocidas como Atlas de Textura) son imágenes grandes que contienen un conjunto de imágenes más pequeñas empacadas en su interior. Ésta técnica comenzó a utilizarse con el surgimiento de las primeras consolas de videojuegos para realizar un mejor aprovechamiento de los recursos, ya que permite aprovechar mejor la memoria de video y realizar el dibujado de manera más eficiente.
http://player.vimeo.com/video/44440528
http://player.vimeo.com/video/55557803

Un uso común de este tipo de imágenes es contener todos los cuadros de un mismo personaje o entidad y animarlo a partír de alli.

IMAGEN DE SPRITESHEET

Los sprites de Haxeflixel permiten trabajar con éste tipo de imágenes y agregar animaciones. Para hacerlo (cargar un ss), en lugar de especificar el archivo de imagen en el constructor del sprite, se debe hacerlo después mediante el método loadGraphic() que permite cargar la imagen especificando parámetros más avanzados.

Al llamar a loadGraphic(), además del nombre del archivo de imagen a utilizar, se le debe especificar un valor booleano como segundo parámetro (true en este caso) indicando que se desea crear animaciones con el spritesheet que se cargará. Y finalmente las dimensiones de los frames o cuadros del spritesheet. En Haxeflixel Solamente se puede trabajar con ss cuyas subimagenes sean del mismo tamaño.

Una vez que hayamos hecho esto, podremos utilizar el atributo animation del sprite para crear y reproducir animaciones con el mismo y con la spritesheet cargada.


El método add() de dicho atributo permite crear una nueva animación para el sprite especificando: un nombre para la misma, un arreglo con los cuadros que lo componen y un valor real que especifica la velocidad de reproducción de la animación en cantidad de cuadros por segundo. El último parámetro corresponde a un valor de verdad que indica si la animación debe o no volver repetirse una vez que haya finalizado.

Una vez se hayan agregado las animaciones al personaje se puede indicar, mediante el método play(), cuál se desea reproducir.

inalmente, para que las animaciones se vean correctamente, será necesario invertir la imagen horizontalmente según el personaje camine en un sentido u otro. Para lograr ésto, se utiliza el atributo flipX de la clase FlxSprite.



DISCUTIR SOBRE EL TEMA DEL INPUT DENTRO DE LA CLASE CHARACTER

## Conclusión








