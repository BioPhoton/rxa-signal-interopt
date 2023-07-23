import { TestBed } from '@angular/core/testing';
import { ListViewComponent } from './list-view.component';

describe(ListViewComponent.name, () => {
  beforeEach(() => {
    TestBed.overrideComponent(ListViewComponent, {
      add: {
        imports: [],
        providers: [],
      },
    });
  });

  it('renders', () => {
    cy.mount(ListViewComponent);
  });
});
