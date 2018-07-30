import { Directive, TemplateRef } from '@angular/core';

// From https://netbasal.com/building-a-simple-carousel-component-with-angular-3a94092b7080

@Directive({
    selector: '[carouselItem]'
})
export class CarouselItemDirective {

    constructor(public tpl: TemplateRef<any>) {
    }

}