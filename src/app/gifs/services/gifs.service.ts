import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private servicioUrl: string = 'http://api.giphy.com/v1/gifs'
  private apiKey: string = 'tdIRzBH2lE83LRoy8gnVCJX2cZbDEF6g'
  private _historial: string[] = [];
  public resultados: Gif[] =[];

  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {

    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];// esta línea es equivalente a las de abajo
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
    //this.buscarGifs(this._historial[0]);
    // if(localStorage.getItem('historial')) {
    //   this._historial = JSON.parse(localStorage.getItem('historial')!);
    // }
  }
  
  buscarGifs(query: string) {

    query = query.trim().toLocaleLowerCase();

    if(!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0,10);

      localStorage.setItem('historial', JSON.stringify(this._historial));

    }

    const params = new HttpParams()
            .set('api_key', this.apiKey)
            .set('q', query)
            .set('limit', '10');

    console.log(params.toString());

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, {params})
      .subscribe( (resp) => {
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });
  }
}
