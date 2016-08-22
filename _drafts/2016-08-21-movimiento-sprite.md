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

Al asignar un valor a la velocidad, el motor actualizará automáticamente la posicion del sprite en cada cuadro, en base a la posicion y velocidad actuales.

Contrario a como se muestra en el ejemplo, no es necesario ajustar la velocidad en cada llamada a *update()*, sino que una vez que se le asignó un valor, la misma seguirá así hasta que lo cambiemos o se modifique por efecto de la física del motor.

Nuevamente es importante notar, que en el código del ejemplo se está invocando al metodo *update()* de la clase padre. Ésto es, una vez más, necesario para el correcto funcionamiento del juego. El comportamiento por defecto del método *update()* de la clase **FlxState** es recorrer la lista de sprites u objetos que fueron agregados a la escena y realizar sobre los mismos las actualizaciones que sean necesarias (por ejemplo actualizar su posición en base a su velocidad, tal como se dijo antes). Si se omite la llamada a *super.update()*, estaremos asignando una velocidad al sprite pero el mismo no se moverá ya que en ningún momento se calculará su nueva posición en base a dicho valor.

## Movimiento uniforme

A continuación vamos a mostrar programa simple en el que se mueve un sprite modificando su velocidad en base a teclas presionadas por el usuario.

Debajo se muestra el contenido del archivo *"PlayState.hx"* del ejemplo, el cual es bastante similar al que se mostró en el tutorial anterior.

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

Se puede acceder al teclado a través de la clase [FlxG](http://api.haxeflixel.com/flixel/FlxG.html). FlxG es una clase de uso general que contiene funciones y atributos que facilitan el acceso a las distintas partes del motor.

En este caso, el atributo [*keys*](http://api.haxeflixel.com/flixel/input/FlxKeyManager.html) corresponde a un objeto que permite conocer el estado actual del teclado. El atributo pressed de dicho objeto permite saber cuáles teclas están actualmente presionadas.

En el cuerpo del método *update()* se le asigna al sprite una velocidad en x, positiva o negativa, según el estado de las teclas A y D. En caso de que ninguna de ellas esté presionada, la velocidad horizontal del sprite será nula.

Como se ve en el ejemplo, para conocer o modificar la velocidad del sprite se puede operar directamente sobre el atributo *velocity* del mismo, el cual es de tipo [**FlxPoint**](http://api.haxeflixel.com/flixel/math/FlxPoint.html) y está a su vez compuesto por otros dos atributos reales: *x* e *y*, que representan sus componentes.

Nuevamente se recuerda que si no se invoca al método *update()* de la clase padre dentro del método redefinido el sprite no se moverá.

Debajo pueden ver el ejemplo en funcionamiento. Hagan click sobre el juego para que éste tome el foco y podrán utilizar las teclas A y D para mover al sprite. Pueden descargar el código fuente del ejemplo [aquí](https://github.com/pabab/pvj2-fichunl-code/blob/master/_zip/sprite_movement_linear.zip?raw=true).

{% include swf_example.html example_name="sprite_movement_linear" modalid="1" %}

## Movimiento con aceleración

En el ejemplo anterior la velocidad varía instantaneamente entre 0 y 200 píxeles por segundo, esto es algo que no ocurre en la vida real. Haxeflixel también permite expresar facilmente movimiento acelerado, es decir, que el cambio de velocidad sea gradual.

Para esto se necesitan 3 valores: una aceleración, variación de la velocidad, una velocidad máxima, una desacelereacion. En haxeflixel se representan con acceleration, maxVelocity, y drag, todos de tipo FlxPoint.  

Si se modifica el valor de acceleratiopn de un sprite el motor de haxeflixel La aceleración cambia la velocidad, la velocidad la posición.

Debajo se observa un ejemplo de esto, el código similar al anterior.

Los valores de MaxVel y drag se pueden especificar solo una vez.
Cambia la aceleracion, no la velocidad (La velocidad la dejamos que la ajuste el motor.)


Usar una constante para la aceleración.

{% include swf_example.html example_name="sprite_movement_accel" modalid="2" %}


## ¿Cuándo conviene utilizar uno u otro tipo de movimiento?

Depende, no hay una respuesta. Depende del efecto que busquemos. El movimiento lineal es bastante característico de juegos de los 80 y aunque se ve poco real, es muy útil cuando el juego requiere un control ajustado del personaje, como por ej en un space shooter en donde el control es crítico.

El movimiento con aceleración generalmente se ve más agradable y real, pero tamién puede ser un poco frustrante para el control. Esto también puede utilizarse para incluir una dificultad adicional para el control, como por ejemplo en ?. También son más parámetros que hay que regular y probar para lograr el mocimiento que se buisca.

Si se eligen bien los valores para la aceleración, velocidad máxima y drag, es posible lograr un movimiento para el personaje que se sienta bien, que los controles se sientan ajustados (o que responden) pero que a la vez se note una leve inercia en el pesonaje que de un sentido más realista al movimiento, por ejemplo en los casos de mario Bros.

## Conclusión
