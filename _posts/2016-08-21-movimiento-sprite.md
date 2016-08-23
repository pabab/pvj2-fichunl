---
layout: post
title: Moviendo un sprite
tags:
  - Tutoriales Haxeflixel
---

En el [tutorial anterior]({{site.baseurl}}/haxeflixel-primer-proyecto/) mostramos un proyecto básico en Haxeflixel en el que se creaba una escena con un sprite. En éste voy a mostrarles cómo mover el sprite mediante el teclado, implementando distintas formas de movimiento.

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

## El método *update()*

El método *update()* es invocado automáticamente en cada frame para actualizar la escena. Recibe como argumento un valor real (Float) con la cantidad de segundos transcurridos desde el la actualización anterior. Redefiniendo éste método en nuestra clase podemos agregar a la escena nuestro propio comportamiento.

Un error muy común a la hora de programar el movimiento de un sprite en Haxeflixel es modificar directamente su posición como se puede observar en el siguiente código.

<div class="code_container">
<pre name="code" class="brush: haxe; toolbar: false; gutter: false;">
override public function update(elapsed: Float):Void
{
  super.update();
  sprite.x = sprite.x + 200;
}
</pre>
</div>

Si bien ésto parece funcionar, la manera correcta de hacerlo es ajustando el atributo *velocity* del sprite, como se muestra debajo, y dejando que el motor actualice automáticamente su position en base a la velocidad. De ésta manera, la velocidad será tenida en cuenta para realizar una correcta detección de colisiones (además de ser más cómodo y hacer el código más corto y legible).

<div class="code_container">
<pre name="code" class="brush: haxe; toolbar: false; gutter: false;">
override public function update(elapsed: Float):Void
{
  super.update();
  sprite.velocity.x = 200;
}
</pre>
</div>

Al asignar un valor a la velocidad, el motor actualizará automáticamente la posición del sprite en cada cuadro, en base a la posición y velocidad actuales.

Contrario a como se muestra en el ejemplo, no es necesario ajustar la velocidad en cada llamada a *update()*, sino que una vez que se le asignó un valor, la misma seguirá así hasta que lo cambiemos o se modifique por efecto de la física del motor.

Nuevamente es importante notar, que en el código del ejemplo se está invocando al metodo *update()* de la clase padre. Ésto es, una vez más, necesario para el correcto funcionamiento del juego. El comportamiento por defecto del método *update()* de la clase **FlxState** es recorrer la lista de sprites u objetos que fueron agregados a la escena y realizar sobre los mismos las actualizaciones que sean necesarias (por ejemplo actualizar su posición en base a su velocidad, tal como se dijo antes). Si se omite la llamada a *super.update()*, estaremos asignando una velocidad al sprite pero el mismo no se moverá ya que en ningún momento se calculará su nueva posición en base a dicho valor.

## Movimiento uniforme

A continuación vamos a mostrar programa simple en el que se mueve un sprite modificando su velocidad en base a teclas presionadas por el usuario.

Debajo se muestra el contenido del archivo *"PlayState.hx"* del ejemplo, el cual es bastante similar al del tutorial anterior.

<div class="code_container">
<pre name="code" class="brush: haxe; toolbar: false; gutter: false;">
import flixel.FlxState;
import flixel.FlxSprite;
import flixel.FlxG;

class PlayState extends FlxState
{
  override public function create():Void
  {
    super.create();
    sprite = new FlxSprite(100, 100, "assets/images/ImpGuy_0.jpg");
    add(sprite);
  }

  override public function update(elapsed):Void
  {
    super.update(elapsed);
    if(FlxG.keys.pressed.A)
    {
      sprite.velocity.x = -200;
    }
    else if(FlxG.keys.pressed.D)
    {
      sprite.velocity.x = 200;
    }
    else
    {
      sprite.velocity.x = 0;
    }
  }

  private var sprite: FlxSprite;
}
</pre>
</div>

Se puede acceder al teclado a través de la clase [FlxG](http://api.haxeflixel.com/flixel/FlxG.html), una clase de uso general que contiene funciones y atributos que facilitan el acceso a las distintas partes del motor.

En este caso, el atributo [*keys*](http://api.haxeflixel.com/flixel/input/FlxKeyManager.html) corresponde a un objeto que permite conocer el estado actual del teclado. El atributo *pressed* de dicho objeto permite saber cuáles teclas están actualmente presionadas.

En el cuerpo del método *update()* se le asigna al sprite una velocidad en x, positiva o negativa, según el estado de las teclas A y D. En caso de que ninguna de ellas esté presionada, la velocidad horizontal del sprite será nula.

Como se ve en el ejemplo, para conocer o modificar la velocidad del sprite se puede operar directamente sobre el atributo *velocity* del mismo, el cual es de tipo [**FlxPoint**](http://api.haxeflixel.com/flixel/math/FlxPoint.html) y está a su vez compuesto por otros dos atributos reales: *x* e *y*, que representan sus componentes.

Nuevamente se recuerda que si no se invoca al método *update()* de la clase padre dentro del método redefinido el sprite no se moverá.

Debajo pueden ver el ejemplo en funcionamiento. Hagan click sobre el juego para que tome el foco y podrán utilizar las teclas A y D para mover al sprite. Pueden descargar el código fuente del ejemplo [aquí](http://github.com/pabab/pvj2-fichunl-code/blob/master/_zip/sprite_movement_linear.zip?raw=true).

{% include swf_example.html example_name="sprite_movement_linear" modalid="1" %}

## Movimiento con aceleración

En el ejemplo anterior la velocidad del sprite cambia instantáneamente entre 0 y 200 píxeles por segundo, lo cual no ocurre con los objetos del mundo real. En Haxeflixel también se puede lograr movimiento acelerado fácilmente, es decir, que el cambio de velocidad resulte gradual.

Para lograr esto es necesario indicar 3 valores:

 * una aceleración, que indica cuánto crece la velocidad con el tiempo
 * un valor máximo para la velocidad, ya que de lo contrario la misma crecería indefinidamente
 * un valor para la desaceleración

En Haxeflixel estos valores se representan con los atributos *acceleration*, *maxVelocity*, y *drag* de la clase **FlxSprite**. Todos, al igual que el atributo *velocity*, son de tipo **FlxPoint**.  

De la misma manera que al asignar un valor a la velocidad del sprite el motor actualiza automáticamente su posición, si se asigna un valor a la aceleración, en cada frame el motor actualizará primero el valor de la velocidad respecto a la aceleración para luego actualizar la posición en base a la velocidad. Es decir que sólo modificamos la aceleración y dejamos que el motor ajuste los valores restantes (velocidad y posición) en base a la misma.

Debajo se observa el código fuente de un ejemplo en el que el movimiento del sprite se realiza de manera acelerada.

<div class="code_container">
<pre name="code" class="brush: haxe; toolbar: false; gutter: false;">
import flixel.FlxSprite;
import flixel.FlxG;

class Character extends FlxSprite
{
	public function new(X: Float, Y: Float)
	{
		super(X, Y, "assets/images/ImpGuy_0.jpg");
		drag.x = SPRITE_DRAG;
		maxVelocity.x = SPRITE_MAXVEL;
	}

	override public function update(elapsed):Void
	{
		super.update(elapsed);
		if(FlxG.keys.pressed.A)
		{
			acceleration.x = -SPRITE_ACCEL;
		}
		else if(FlxG.keys.pressed.D)
		{
			acceleration.x = SPRITE_ACCEL;
		}
		else
		{
			acceleration.x = 0;
		}
	}
  private static inline var SPRITE_ACCEL: Float = 200;
  private static inline var SPRITE_MAXVEL: Float = 200;
  private static inline var SPRITE_DRAG: Float = 200;
}
</pre>
	</div>

<script type="text/javascript">
    SyntaxHighlighter.all()
</script>

Los valores de los atributos *maxVelocity* y *drag* del sprite se pueden fijar durante la inicialización de la escena, ya que no sufrirán cambios luego.

De manera similar al ejemplo anterior, en éste se modifica el valor de la aceleración en base a las teclas presionadas. Al presionar las teclas A o S, la velocidad del sprite comenzará a aumentar en uno u otro sentido. Cuando la velocidad del sprite alcance un valor mayor o igual a lo indicado por su atributo *maxVelocity* dejará de aumentar y se mantendrá en ese valor.

Finalmente, el atributo *drag*, en Haxeflixel, indica un valor de desaceleración que se aplica únicamente cuando la aceleración es nula. Es decir, cuando hacemos que *aceleration.x* sea igual a 0 el valor de *drag* comienza a actuar disminuyendo la velocidad hasta que esta llegue a 0.

En el código también se puede notar que se han utilizado constantes para los valores de la aceleración, velocidad máxima y drag. En Haxeflixel las constantes se declaran anteponiendo las palabras reservadas **static** e **inline**.

Debajo pueden ver el ejemplo en funcionamiento. Hagan click sobre el juego para que tome el foco y podrán utilizar las teclas A y D para mover al sprite. Pueden descargar el código fuente del ejemplo [aquí](http://github.com/pabab/pvj2-fichunl-code/blob/master/_zip/sprite_movement_accel.zip?raw=true)

{% include swf_example.html example_name="sprite_movement_accel" modalid="2" %}


## ¿Cuándo conviene utilizar uno u otro tipo de movimiento?

No hay una respuesta correcta ya que depende, entre varios factores, del efecto que se desee lograr.

El movimiento uniforme es bastante característico de juegos de los juegos arcade y, aunque se ve poco real, resulta muy útil cuando se requiere un control ajustado y que responda rápido, como por ejemplo en el género space shooter.

El movimiento con aceleración generalmente se ve más real y agradable, pero también puede resultar un poco frustrante para el jugador si la inercia es demasiada, lo cual también puede utilizarse en macánicas que impliquen controles difíciles de dominar. Éste tipo de control también implica más parámetros que será necesario probar y ajustar para lograr un movimiento agradable del personaje.

Si se eligen bien los valores para la aceleración, velocidad máxima y drag, es posible lograr controles que se sientan bien y respondan rápido pero que a la vez otorguen a los objetos una leve inercia que que haga al movimiento sentirse más suave y realista, como por ejemplo en el caso de los juegos de la saga Mario Bros.

## Conclusión

En éste artículo mostramos como mover un sprite mediante el teclado utilizando dos tipos distintos de movimiento. Se recomienda dar una mirada a la documentación de Haxeflixel para las clases utilizadas hasta el momento ([**FlxState**](http://api.haxeflixel.com/flixel/FlxState.html), [**FlxSprite**](http://api.haxeflixel.com/flixel/FlxSprite.html), [**FlxPoint**](http://api.haxeflixel.com/flixel/math/FlxPoint.html) y [**FlxG**](http://api.haxeflixel.com/flixel/FlxG.html)) para tener una mejor idea general de las funciones del motor.
