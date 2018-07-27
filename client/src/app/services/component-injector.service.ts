import {
    ComponentFactoryResolver,
    Injectable,
    Inject
} from '@angular/core';

@Injectable()
export class ComponentInjectorService {

    private factoryResolver;
    private rootViewContainer;

    constructor(@Inject(ComponentFactoryResolver) factoryResolver) {
        this.factoryResolver = factoryResolver
    }

    public setRootViewContainerRef(viewContainerRef) {
        this.rootViewContainer = viewContainerRef
    }

    public addComponent(theComponent) {
        const factory = this.factoryResolver.resolveComponentFactory(theComponent);
        const component = factory.create(this.rootViewContainer.parentInjector);
        this.rootViewContainer.insert(component.hostView);
    }
}