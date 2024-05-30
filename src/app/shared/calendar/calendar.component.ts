import { Component, ContentChild, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import chroma from 'chroma-js';
import { MenuItem } from 'primeng/api';
import { Methods } from 'src/app/utils/methods';

export interface Out{
  id?: number;
  start?: Date;
  end?: Date;
  originalEvent?: Event;
}
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input() menuItems: MenuItem[];
  @Input() titleName: string = 'title';
  @Input() startDateName: string = 'start';
  @Input() endDateName: string = 'end';
  @Input() id: string = 'id';
  @Input() data: any[] = [];
  @Input() hexColor: string;

  @Output() dropEvent:   EventEmitter<Out> = new EventEmitter<Out>();
  @Output() resizeEvent: EventEmitter<Out> = new EventEmitter<Out>();
  @Output() doubleClickOnDate: EventEmitter<Out> = new EventEmitter<Out>();
  @Output() clickOnDate: EventEmitter<Out> = new EventEmitter<Out>();
  @Output() doubleClickOnEvent: EventEmitter<Out> = new EventEmitter<Out>();
  @Output() clickOnEvent: EventEmitter<Out> = new EventEmitter<Out>();

  @ContentChild(TemplateRef) overlayContentTemplate: TemplateRef<any>;

  clickTimeout: any = null;
  showedIcons: any = {};
  calendarOptions: CalendarOptions;

  generatedColors = new Set();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.calendarOptions) {
      this.calendarOptions.events = this.updateEvents(this.calendarOptions.events ?? [], this.data);
    }
  }

  ngOnInit(): void {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      locale: 'es',
      editable: true,
      headerToolbar: {start: 'title', center:'',  end: 'today,dayGridWeek,dayGridMonth,dayGridYear,prev,next'},
      buttonText: {today: 'Hoy', month: 'Mes', year: 'Año', week: 'Semana', day: 'Día', list: 'Lista'},
      dateClick: (arg) => this.handleClickOnDate(arg),
      eventDrop: this.handleEventDrop.bind(this),
      eventResize: this.handleEventResize.bind(this),
      eventClick: this.handleClickOnEvent.bind(this),
      events: this.data.map(e => this.parseDataToEvent(e))
    };
  }

  parseDataToEvent(item: any){
    let end: Date = new Date(item[this.endDateName]);
    end.setTime(end.getTime() + (24 * 60 * 60 * 1000));//Para que el día termine a las 23:59:59 o antes de empezar el otro día
    return {
      id: item[this.id],
      title: item[this.titleName],
      start: Methods.formatToString(new Date(item[this.startDateName]), 'yyyy-mm-dd'),
      end: Methods.formatToString(end, 'yyyy-mm-dd'),
      color: this.hexColor ?? this.generateRandomColor(),
      data: item
    }
  }

  private generateRandomColor(){
    let color;
    do {
      color = chroma.random().set('hsl.s', 0.6).set('hsl.l', 0.8).hex();
    } while (this.generatedColors.has(color));
    this.generatedColors.add(color);
    return color;
  }

  private updateEvents(events, newEvents) {
    newEvents.forEach(e => {
        let exists = events.find(evento => evento.id === e.id);
        if (exists) {
          let obj = this.parseDataToEvent(e);
          obj.color = exists.color;
          Object.assign(exists, obj);
        }else{
          events.push(this.parseDataToEvent(e));
        }
    });
    events = events.filter(e => newEvents.some(obj => obj.id === e.id));
    return events;
  }

  handleClickOnEvent(info: any) {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
      this.onDoubleClickOnEvent(info);
    } else {
      this.clickTimeout = setTimeout(() => {
        this.clickTimeout = null;
        this.onClickOnEvent(info);
      }, 300);
    }
  }

  handleClickOnDate(info: any) {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
      this.onDoubleClickOnDate(info);
    } else {
      this.clickTimeout = setTimeout(() => {
        this.clickTimeout = null;
        this.onClickOnDate(info);
      }, 300);
    }
  }

  onClickOnDate(arg) {
    arg.jsEvent.preventDefault();
    return this.clickOnDate.emit({start: arg.date, end: arg.date, originalEvent: arg.jsEvent});
  }

  onDoubleClickOnDate(arg: any) {
    arg.jsEvent.preventDefault();
    return this.doubleClickOnDate.emit({start: arg.date, end: arg.date, originalEvent: arg.jsEvent});
  }

  onClickOnEvent(arg: any) {
    const event = arg.event;
    arg.jsEvent.preventDefault();
    return this.clickOnEvent.emit({id: event.id, originalEvent: arg.jsEvent});
  }

  onDoubleClickOnEvent(arg: any) {
    const event = arg.event;
    arg.jsEvent.preventDefault();
    return this.doubleClickOnEvent.emit({id: event.id, originalEvent: arg.jsEvent});
  }

  handleEventDrop(arg: any) {
    const event = arg.event;
    arg.jsEvent.preventDefault();
    let end: Date = event.end ?? event.start;
    if (event.end){
      end.setTime(end.getTime() - (24 * 60 * 60 * 1000));
    }
    return this.dropEvent.emit({id: event.id, start: event.start, end: end, originalEvent: arg.jsEvent});
  }

  handleEventResize(arg: any) {
    const event = arg.event;
    arg.jsEvent.preventDefault();
    let end: Date = event.end ?? event.start;
    if (event.end){
      end.setTime(end.getTime() - (24 * 60 * 60 * 1000));
    }
    return this.resizeEvent.emit({id: event.id, start: new Date(Methods.formatToString(event.start, 'yyyy-mm-dd')), end: new Date(Methods.formatToString(end, 'yyyy-mm-dd')), originalEvent: arg.jsEvent});
  }

  toggleIcon(show: boolean, idEvent){
    this.showedIcons[idEvent] = show;
  }

}
