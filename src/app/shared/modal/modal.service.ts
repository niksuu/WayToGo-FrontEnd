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
    // Create the modal component dynamically
    const modalComponentFactory = this.componentFactoryResolver.resolveComponentFactory(ModalComponent);
    const modalComponentRef = modalComponentFactory.create(this.injector);

    // Create the content component dynamically
    const contentComponentFactory = this.componentFactoryResolver.resolveComponentFactory(componentSelector);
    const contentComponentRef = contentComponentFactory.create(this.injector);

    // Pass inputs to the content component if provided
    if (inputs) {
      Object.keys(inputs).forEach((key) => {

        console.log(`${key}: ${inputs[key]} efw`);
        contentComponentRef.instance[key] = inputs[key];
        console.log(`${key}: ${inputs[key]}`);
        contentComponentRef.setInput('data', "Hello");
        if (contentComponentRef.instance[key] !== undefined) {
          contentComponentRef.instance[key] = inputs[key];
          console.log(`${key}: ${inputs[key]}`);
          contentComponentRef.setInput('data', "Hello");
        }
      });
    }

    // Attach the content component to the modal
    this.appRef.attachView(contentComponentRef.hostView);
    const modalElement = (modalComponentRef.hostView as any).rootNodes[0] as HTMLElement;
    const contentElement = (contentComponentRef.hostView as any).rootNodes[0] as HTMLElement;

    modalElement.querySelector('.modal-content')?.appendChild(contentElement);

    // Attach the modal to the DOM
    this.appRef.attachView(modalComponentRef.hostView);
    document.body.appendChild(modalElement);

    // Clean up the content component when the modal is closed
    (modalComponentRef.instance as any).closeModal = () => {
      this.appRef.detachView(modalComponentRef.hostView);
      modalComponentRef.destroy();
      this.appRef.detachView(contentComponentRef.hostView);
      contentComponentRef.destroy();
    };
  }
}
