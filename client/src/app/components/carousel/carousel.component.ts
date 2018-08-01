import { Component, Directive, AfterViewInit, ContentChildren, ViewChildren, ViewChild, Input, ElementRef, QueryList } from '@angular/core';
import { AnimationPlayer, AnimationFactory, AnimationBuilder, animate, style } from '@angular/animations';
import { CarouselItemDirective } from '../../directive/carousel-item.directive';

// From https://netbasal.com/building-a-simple-carousel-component-with-angular-3a94092b7080

@Directive({
  selector: '.carousel-item'
})
export class CarouselItemElement {
}

@Component({
  selector: 'app-carousel',
  exportAs: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements AfterViewInit {

  @ContentChildren(CarouselItemDirective) public items: QueryList<CarouselItemDirective>;
  @ViewChildren(CarouselItemElement, { read: ElementRef }) private itemsElements: QueryList<ElementRef>;
  @ViewChild('carousel') private carousel: ElementRef;
  @Input() private timing = '250ms ease-in';
  @Input() public showControls = true;
  private player: AnimationPlayer;
  private itemWidth: number;
  private currentSlide = 0;
  public carouselWrapperStyle = {};

  constructor(private builder: AnimationBuilder) {
  }

  ngAfterViewInit() {
    // For some reason only here I need to add setTimeout, in my local env it's working without this.
    setTimeout(() => {
      this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
      this.carouselWrapperStyle = {
        width: `${this.itemWidth}px`
      }
    });
  }

  public next() {
    if (this.currentSlide + 1 === this.items.length) {
      return;
    };
    this.currentSlide = (this.currentSlide + 1) % this.items.length;
    this.animate();
  }

  public prev() {
    if (this.currentSlide === 0) {
      return;
    }
    this.currentSlide = ((this.currentSlide - 1) + this.items.length) % this.items.length;
    this.animate();
  }

  public goTo(index: number) {
    if (this.currentSlide === index) {
      return;
    }
    if (index >= this.items.length) {
      console.warn('Trying to access slide %d which does not exists');
      return;
    }
    this.currentSlide = index;
    this.animate();
  }

  private animate() {
    const offset = this.currentSlide * this.itemWidth;
    const myAnimation: AnimationFactory = this.buildAnimation(offset);
    this.player = myAnimation.create(this.carousel.nativeElement);
    this.player.play();
  }

  private buildAnimation(offset) {
    return this.builder.build([
      animate(this.timing, style({ transform: `translateX(-${offset}px)` }))
    ]);
  }

}
