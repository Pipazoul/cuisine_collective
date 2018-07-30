import {
    ComponentFactoryResolver,
    Injectable,
    Inject,
    ViewContainerRef,
    Type
} from '@angular/core';

@Injectable()
export class ComponentInjectorService {

    private factoryResolver;

    constructor(@Inject(ComponentFactoryResolver) factoryResolver) {
        this.factoryResolver = factoryResolver
    }

    public addComponent<T>(viewContainerRef: ViewContainerRef, theComponent: Type<T>) {
        const rootViewContainer = viewContainerRef;
        const factory = this.factoryResolver.resolveComponentFactory(theComponent);
        const component = factory.create(rootViewContainer.parentInjector);
        rootViewContainer.insert(component.hostView);
    }
}