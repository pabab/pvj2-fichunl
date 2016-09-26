---
layout: post
title: Movimiento de un personaje de plataformas
tags:
  - Tutoriales Haxeflixel
---
En éste articulo explicaremos cómo implementar el movimiento de un personaje para un juego de plataformas.

Además de las colisiones con el nivel (para lo cual utilizamos un tilemap en ejemplos anteriores), el movimiento en un escenario de plataformas implica lo siguiente:

* Otorgar gravedad al personaje para que caiga
* Agregar la acción de saltar
* Controlar el salto para que se pueda hacer únicamente cuando el personaje está tocando el suelo (que no pueda saltar infinitamente en el aire)

Para el motor de colisiones de Haxeflixel no existe una gravedad global sino que se debe agregar aceleración a cada objeto, lo cual se puede hacer modificando el atributo *acceleration*. En el código que aparece debajo se puede ver el constructor de un personaje, en el que se asigna un valor positivo para la componente vertical de la aceleración (es decir, hacia abajo). Al hacer esto el personaje caerá hasta que el otro objeto (en ésta caso el piso, representado por un tilemap) detenga su trayectoria. Recordar que será necesario invocar a *collide()* desde la escena para detectar y resolver colisiones entre el personaje y el nivel.


<div class="code_container">
<pre name="code" class="brush: haxe; toolbar: false; gutter: false;">
class Character extends FlxSprite
{
    public function new(X: Float, Y: Float)
    {
        super(X, Y);
        loadGraphic("assets/images/char_sheet.png", true, 16, 16);
        animation.add("idle", [0, 1, 2, 3], 4, true);
        animation.add("walk", [5, 6, 7], 10, true);
        animation.add("jump", [8], 10, true);
        animation.add("fall", [9], 10, true);
        animation.play("idle");
        acceleration.y = 300;
    }

    ...
</pre>
</div>

## Salto

Para que el personaje salte es necesario ajustar su velocidad vertical dándole signo opuesto al de la aceleración que se le otorgó (es decir negativo o hacia arriba). Una vez hecho ésto, a medida que el personaje sube, la velocidad será gradualmente contrarrestada por la aceleración hasta anularse cuando el personaje alcance el punto máximo del salto. Luego comenzará a crecer nuevamente en el mismo sentido de la aceleración (hacia abajo) hasta que el personaje toque el suelo.

Es importante notar que, para que el personaje pueda experimentar un correcto movimiento acelerado de elevación y caída, la velocidad debe ser ajustada por única vez cuando el jugador presione le tecla de salto y luego quedar sometida a la aceleración aplicada por el motor de física (la cual permanecerá constante con el valor que se le asignó en el constructor del objeto).

Ésto se puede lograr mediante el atributo [*justPressed*](http://api.haxeflixel.com/flixel/input/FlxKeyManager.html#justPressed) del objeto *keys* utilizado en los ejemplos anteriores. A diferencia de *pressed*, *justPressed* únicamente dará verdadero si una tecla no estaba presionada antes y fue presionada en el cuadro actual. Si en lugar de *justPressed* se utilizara *pressed* para el salto, el personaje tendría una velocidad constante hacia arriba hasta que la tecla sea soltada, lo cual le permitiría elevarse sin límite.

Debajo puede verse un fragmento de código del método *update()* del personaje en el que se le otorga una velocidad de salto al presionarse la tecla *W*. Los elementos restantes del código se explicarán en la siguiente sección.

<div class="code_container">
<pre name="code" class="brush: haxe; toolbar: false; gutter: false;">
public override function update(elapsed: Float)
{
    super.update(elapsed: Float);

    ...

    if(FlxG.keys.justPressed.W && (wasTouching & FlxObject.FLOOR != 0))
    {
        y--;
        velocity.y = -150;
    }

    if(wasTouching & FlxObject.FLOOR == 0)
    {
        if(velocity.y > 0)
        {
            animation.play("fall");
        }
        else
        {
            animation.play("jump");
        }
    }
}
</pre>
</div>


## Detección del contacto con el suelo

Para que el personaje no pueda volver a saltar estando en el aire es necesario que la velocidad de salto sea aplicada únicamente si se encuentra tocando el suelo.

El hecho de que el motor de física de Haxeflixel utilice AABBs como figuras de colisión simplifica enormente esta tarea, ya que un objeto sólo puede colisionar con otro en cuatro direcciones.

Las direcciones en las que un objeto colisionó se pueden conocer mediante el atributo [*wasTouching*](http://api.haxeflixel.com/flixel/FlxObject.html#wasTouching), el cual consiste en un entero cuyos bits indican desde cuáles lados colisionó éste objeto con otros en la última llamada a *collide()*.

Para saber, entonces, si el personaje está en contacto con el suelo, es posible utilizar el operador *&*(AND a nivles de bits) para averiguar si el bit correspondiente a la dirección del piso está encendido. Un resultado distinto de cero indica que el bit está en 1, es decir, que el personaje se solapó con otro objeto desde abajo y que su posición fue ajustada por *collide()* en la última llamada.

Como detalle adicional, para que el personaje salte correctamente en éste caso, será necesario desplazarlo levemente hacia arriba decrementando en una unidad a su posición en Y.

Ésto ocurre por lo siguiente: la llamada a *super.update()* (que actualiza la velocidad del personaje en función de la aceleración) se ejecuta al principio de la actualización del personaje por lo cual, al asignarle la velocidad de salto, ésta no tendrá efecto hasta la próxima actualización. Sin embargo, dado que la aceleración es constante, ya ha afectado a la posición del personaje en la llamada a *super.update()*, por lo cual el mismo se ha desplazado levemente hacia abajo y está solapándose con el suelo (aunque luego será separado al invocar a *collide()*). Antes de la próxima actualización del personaje, *collide()* detectará ésta situación y no sólo separará al personaje del suelo sino que anulará su velocidad vertical, sobreescribiendo el valor que nosotros le habíamos asignado.  

En otras palabras, al tener aceleración vertical hacia abajo, el personaje se encuentra cayendo, solapándose con el suelo (aunque muy poco) y siendo separado del mismo en cada actualización, lo cual implica que su velocidad vertical sea anulada en éste proceso. Para evitar que *collide()* anule la velocidad del personaje, lo desplazamos levemente hacia arriba antes de saltar para que no entre en contacto con el suelo.

Finalmente, como se puede observar en el código anterior, el atributo *wasTouching* también se puede utilizar para detectar cuándo el personaje está en el aire (ya sea saltando o cayendo) y reproducir la animación correspondiente.

Debajo pueden observar el ejemplo en funcionamiento, y pueden descargar el código fuente [aquí](https://github.com/pabab/pvj2-fichunl-code/blob/master/_zip/platformer.zip?raw=true).

{% include swf_example.html example_name="platformer" modalid="1" %}

<script>
  $(document).ready(function(){
    SyntaxHighlighter.all()
  });
</script>
