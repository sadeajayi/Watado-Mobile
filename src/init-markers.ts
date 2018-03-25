export interface Marker {
  name?: string;
  lat: number;
  lng: number;  
}
export class Init{
  load(){
    if(localStorage.getItem('markers') === null || localStorage.getItem('markers') === undefined){
     console.log("No markers found .... creating...")

      var markers =[
        {
          name:'Eat Drink Fest',
          lat:6.423021,
          lng: 3.445057,
          draggable: true
        },
        {
          name: 'Terra Kulture',
           lat: 6.425286,
           lng: 3.426844,
          draggable: true
        },
        {
          name: 'Company Three',
          lat: 6.5244,
          lng: 3.3792,
          draggable: false
        }
      ]

      localStorage.setItem('markers',JSON.stringify(markers));
    }else {
      console.log('Loading markers...');
      var markers =[
        {
          name:'Eat Drink Fest',
          lat:6.423021,
          lng: 3.445057,
          draggable: true
        },
        {
          name:'Terra Kulture',
           lat: 6.425286,
           lng: 3.426844,
          draggable: true
        },
        {
          name: 'Company Three',
          lat: 6.5244,
          lng: 3.3792,
          draggable: false
        }
      ]
    localStorage.setItem('markers',JSON.stringify(markers));
    }

  }

}