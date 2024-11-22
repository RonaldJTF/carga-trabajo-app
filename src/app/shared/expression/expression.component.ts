import { AfterViewInit, Component, Input, SimpleChanges } from '@angular/core';
import { all, create} from 'mathjs';

import { MathjaxService } from 'src/app/services/mathjax.service';

@Component({
  selector: 'app-expression',
  templateUrl: './expression.component.html',
  styleUrls: ['./expression.component.scss']
})
export class ExpressionComponent implements AfterViewInit{
  @Input() expression: string;

  outExpression: string;
  
  constructor(
    private mathJaxService: MathjaxService
  ){}

  ngOnInit(){
    this.buildExpression();
  }

  ngAfterViewInit() {
    //this.mathJaxService.renderMath();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expression']) {
      this.buildExpression();
      setTimeout(() => this.mathJaxService.renderMath(), 0); 
    }
  }

  private buildExpression(){
    try {
      if (this.expression != undefined && this.expression != null && this.expression.trim()){
        const math = create(all);
        const node = math.parse(this.expression);
        const latex = node.toTex();
        this.outExpression = `$$ ${latex} $$`;
      }else{
        this.outExpression = "No se encontró expresión"
      }
    }catch{
      console.log('Error of expression')
    }
  }
}