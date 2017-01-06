'use strict';
class Default{
	constructor( event, trigger, target, time ){
		this.event = event;
		this.trigger = trigger;
		this.target = target;
		this.time = time;
		// INIT THE EFFECT EXECUTION
		this.init();
	}
	get instance(){
		return this;
	}
}
// DROPDOWN CLASS
class Dropdown extends Default{
	init(){
		const self = this;
		$( self.trigger )
		.unbind(  self.event )
		.bind(  self.event , function(){			
			/*
			<--
			# desactivate others when effect comes up
				 $( trigger+'[data-active="true"]' )
				 .attr( "data-active", false )
				 .next( target )
				 .slideToggle( time )
				 .attr( "data-active", false );
			 -->
			 */

			 if ( $( this ).attr( "data-active") == "true" ) {
			 	$( this )
			 	.attr( "data-active", false )
			 	.next(  self.target )
			 	.slideToggle(  self.time )
			 	.attr( "data-active", false );
			 	return;
			 }


			 $( this )
			 .attr( "data-active", true )
			 .next(  self.target )
			 .slideToggle(  self.time )
			 .attr( "data-active",  true );

			});
	}
}
// SLIDER CLASS
class Slider extends Default{
	init(){
		const self = this;
		$( self.trigger )
		.unbind( self.event )
		.bind( self.event, function(){

			$( self.target )
			.attr( "data-active", false)
			.slideUp( self.time );

			$( self.trigger )
			.attr( "data-active", false );


			$( self.target+':nth-child('+ ( $( this ).index() + 1) +')' )
			.slideDown( self.time )
			.attr( "data-active", true );

			$( this )
			.attr( "data-active", true );

		});
		$( self.trigger+':nth-child(1) ' ).trigger( "click" );
	}
}
// TABS CLASS
class Tabs extends Default{
	init(){
		const self = this;
		$( self.trigger )
		.unbind( self.event )
		.bind( self.event, function(){

			$( self.target )
			.attr( 'data-active', false )
			.css( 'display', 'none' );

			$( self.trigger )
			.attr( 'data-active', false );

			$( self.target+':nth-of-type('+ ( $( this ).index() + 1 ) +')' )
			.toggle( self.time )
			.attr( 'data-active', true );

			$( this )
			.attr( 'data-active', true );

		});
		$( self.trigger+':nth-child(1)' ).trigger( 'click' );
	}
}
// ACCORDION CLASS
class Accordion extends Default{
	init(){
		const self = this;
		$( self.trigger )
		.unbind( self.event )
		.bind( self.event, function(){

			if ( $( this ).attr( 'data-active' ) == 'true' ) {
				
				$( this )
				.attr( 'data-active', false );

				$( this )
				.next( self.target )
				.slideToggle( self.time )
				.attr( 'data-active', false );
				return;
			}

			$( self.trigger+'[data-active="true"]' )
			.attr( 'data-active', false )
			.next( self.target )
			.slideToggle( self.time )
			.attr( 'data-active', false );

			$( self.trigger )
			.attr( 'data-active', false );

			$( self.target )
			.attr( 'data-active', false );

			$( this )
			.attr( 'data-active', true )
			.next( self.target )
			.slideToggle( self.time )
			.attr( 'data-active', true );

		});
		$( self.target ).css('display', 'none');
	}
}
// MODAL CLASS
class Modal extends Default{
	constructor( event, trigger, target, time ){
		super( event, trigger, target, time );
		//<-----
		//styles
		//set modal panel style
		//----->
		$( this.target ).css({
			'width': '100vw',
			'height': '100vh',
			'position': 'fixed',
			'background': 'rgba(0, 0, 0, 0.8)',
			'left':'0',
			'top':'0',
			'z-index': '5000'
		}); 
		// set modal content (white panel) style
		$( '[data-modal="content"' ).css({
			'width':'80vw',
			'height':'80vh',
			'left':'0',
			'right':'0',
			'margin': '0 auto',
			'top':'10vh',
			'background':'#FFF',
			'position':'absolute',
			'padding':'10vh',
			'color':'#000',
			'z-index':'10000',
			'font-size':'10vw',
			'cursor':'default'
		});
		return this;
	}
			//SET THE close function, to bind in elements
			close(){
				$( this.target )
				.fadeOut( this.time );

				$( this.trigger )
				.attr( 'data-active', false );
				$( this.target )
				.attr( 'data-active', false );
			}
			/*
			#other animations properties
				.toggle( time )
				.slideToggle( time )
				.slideDown( time )
				.slideUp( time )
				*/

				init(){
					const self = this;
					$( self.trigger )
					.unbind( self.event )
					.bind( self.event, function(){
						$( this )
						.attr( 'data-active', true )
						.nextAll( self.target )
						.eq(0)
						.fadeIn( self.time )
						.attr( 'data-active', true );
					});

					if ( $( '[data-modal="close"]' ) ) {
						$( '[data-modal="close"]' ).css({
							'width':' 5vw',
							'height':' 5vh',
							'position':'absolute',
							'right':' 0',
							'top':' 0',
							'line-height':' 5vh',
							'text-align':' center',
							'font-size':' 3vw',
							'color':'#FFF',
							'background':'#E85151',
							'cursor':'pointer'
						});

						$( '[data-modal="close"]' )
						.unbind( 'click' )
						.bind( 'click', function(){
							self.close();
						});
					}
					if ( $( '[data-modal="outer"]' ) ) {
						$( '[data-modal="outer"' ).css({
							'width':'100vw',
							'height':'100vh',
							'position':'absolute',
							'cursor':'default'
						});

						$( '[data-modal="outer"]' )
						.unbind( 'click' )
						.bind( 'click', function(){
							self.close();
						});
					}
					$( self.target ).css( 'display', 'none' );
				}
			}
// PARALLAX CLASS
class customParallax{
	constructor( element , xPos , dataAttr ){
		// it's necessary to call constructor of super class to overwrite it
		//super();
		this.element = element;
		this.xPos = xPos;
		this.dataAttr = dataAttr;
		this.init();
		// and it's necessary to return the overwritter constructor too
		//return this;
	}
	init(){
		const self = this;
		if ( !self.xPos ) self.xPos = '50%';
		if ( !self.dataAttr ) self.dataAttr = self.element;
		self.dataAttr = self.dataAttr.replace('[','').replace(']','');
		$( self.element ).each(function() {
			$( this ).css({
				'max-width':'100%',
				'position':' relative',
				'background-position': self.xPos +' 0' ,
				'background-repeat':' no-repeat',
				'background-attachment':' fixed',
			});
			var $obj = $( this );
			$( window ).scroll(function() {
				var offset = $obj.offset();
				var yPos = - ( $(window).scrollTop() - offset.top ) / $obj.attr( self.dataAttr );
				var bgPos = self.xPos + '' + yPos + 'px';
				$obj.css('background-position', bgPos);
				if ( $( '[data-parallax-content]' ) ) {
					$( '[data-parallax-content]' ).css({
						'margin-top': - ( $( window ).scrollTop() / 3 ) + "px",
						'opacity': 1 - ( $( window ).scrollTop() / 480),
						'text-shadow': '0px -'+( $( window ).scrollTop() / 3 )+'px 10px'
					});
				}
			});
		});
	}
}
// PARALLAX
class Parallax{
	constructor( container , speed , axisX = '50%' ){
		this.container = container;
		this.dataAttr = speed;
		this.axisX = axisX;
		this.init();
	}
	init(){
		
		var speedAttr = this.dataAttr;
		var axisX = this.axisX;
		
		$( this.container ).each( function( idx , el ){
	 	
	 		var $element = $( el );
        	var elementSpeed = $( el ).data( speedAttr );
        	console.log( elementSpeed )
        	
        	$(window).scroll(function() {
        		var yPos = -( $(window).scrollTop() / elementSpeed ); 
        		yPos += 64;
        		var bgpos = axisX + ' ' + yPos + 'px';
         
        		$element.css('background-position', bgpos );
         
        	}); 
        });
	}
}
// COUNTER CLASS
class Counter{
	constructor( element , where = 0 , to , time ){
		this.element = element;
		this.where = where;
		this.to = to;
		this.time = time;
		this.init();
	}
	init(){
		const self = this;
		var counted = setInterval( 
			function(){
				$( self.element ).html( self.where );
				if ( self.where == self.to ) clearInterval( counted );
				self.where++;
			} ,
			self.time );
	}
}