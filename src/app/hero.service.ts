import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl = 'api/heroes'; // URL to web api
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`found heroes matching "${term}"`)
          : this.log(`no heroes matching "${term}"`)
      ),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((_) => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    //The catchError() operator intercepts an Observable that failed then passes the error to the error handling function.
    return this.http
      .get<Hero[]>(this.heroesUrl)
      .pipe(catchError(this.handleError<Hero[]>('getHeroes', [])));
  }

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap((_) => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  //Il seguente metodo gestisce l'operazione HTTP fallita loggando l'errore e ritornando un oggetto "innocuo" (vuoto) per fare in modo che l'applicazione continui a funzionare.
  //NB: il metodo, implementato in questo modo, può essere utilizzato per qualunque chiamata, basta "tipizzare" l'observable secondo l'interfaccia/classe utilizzata ed il gioco è fatto!
  //Nel nostro caso se nel metodo "getHeroes" la chiamata "this.http.get<Hero[]>(this.heroesUrl)" fallisce, scatta il metodo "pipe(catchError())" che gestirà l'errore loggando che il metodo 'getHeroes' è andato in errore (parametro "operation") e ritornando un array vuoto di tipo Hero così l'applicazione continuerà a funzionare (anche se non visualizzerà dati).
  //Parametri:
  //1) operation --> name of the operation that failed
  //2) result --> optional value to return as the observable result
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  //Questo metodo è stato sostitutito da "getHeroes()" nella versione che utilizza HttpClient
  getHeroes_OLD(): Observable<Hero[]> {
    //of() è un operatore di RxJS che permette di creare un Observable (quindi uno stream) da una sorgente.
    //Una volta che tutti i valori sono stati trasmessi verrà inviata una notifica di completamento tramite
    //la chiamata "completed" che indicherà che l'Observable non trasmetterà più nuovi valori.
    const heroes = of(HEROES);
    this.messageService.add('HeroService: fetched heroes');
    return heroes;
  }

  //Questo metodo è stato sostitutito da "getHero()" nella versione che utilizza HttpClient
  getHero_OLD(id: number): Observable<Hero> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const hero = HEROES.find((h) => h.id === id)!;
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(hero);
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
