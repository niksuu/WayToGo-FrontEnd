import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector, Type } from "@angular/core";
import { ModalComponent } from "./modal.component";

@Injectable({ providedIn: 'root' })
export class ModalService {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef
  ) {}

  openModal(componentSelector: Type<any>, inputs?: { [key: string]: any }) {
    //creating modal (component) dynamically
    const modalComponentFactory = this.componentFactoryResolver.resolveComponentFactory(ModalComponent);
    const modalComponentRef = modalComponentFactory.create(this.injector);

    //creating content (component) dynamically
    const contentComponentFactory = this.componentFactoryResolver.resolveComponentFactory(componentSelector);
    const contentComponentRef = contentComponentFactory.create(this.injector);

    //passing @Inputs to the content component
    if (inputs) {
      Object.keys(inputs).forEach((key) => {
          contentComponentRef.instance[key] = inputs[key];
      });
    }

    //attach content to modal (populate modal with content)
    this.appRef.attachView(contentComponentRef.hostView);
    const modalElement = (modalComponentRef.hostView as any).rootNodes[0] as HTMLElement;
    const contentElement = (contentComponentRef.hostView as any).rootNodes[0] as HTMLElement;

    modalElement.querySelector('.modal-content')?.appendChild(contentElement);

    //attach modal to the DOM
    this.appRef.attachView(modalComponentRef.hostView);
    document.body.appendChild(modalElement);

    //clean up content component when the modal is closed
    (modalComponentRef.instance as any).closeModal = () => {
      this.appRef.detachView(modalComponentRef.hostView);
      modalComponentRef.destroy();
      this.appRef.detachView(contentComponentRef.hostView);
      contentComponentRef.destroy();
    };
  }
}
