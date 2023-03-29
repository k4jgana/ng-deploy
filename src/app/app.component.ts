import { Component } from '@angular/core';
import axios from 'axios';
import * as anime from 'animejs/lib/anime.js';
import { Router } from '@angular/router';
import * as QRCode from 'qrcodejs';

@Component({
  selector: 'app-root',
  templateUrl:'./app.component.html',
  styleUrls:['./app.component.css']
})
export class AppComponent {
  song: string = '';
  verse:string='';
  artist:string='';
  spotify_url:string='';
  clientId:string="3cfa9c50499848ca928db896fa4afe3c";
  clientSecret:string="02c47de82dfb4d5fa1d40d9d5f534896";

  constructor(private router: Router) {}

  ngOnInit() {
    const enteredPassword = prompt('Please enter the password:');
    const expectedPassword = '1304'; // Replace with your own password

    if (enteredPassword === expectedPassword) {
      // Password is correct, load the content
      const playlists = ['0QSyycAM9vfLwVcOLEBwKr', '0OZcyYy3RcLhFUTDYCcAVf', '7Kx3lyvRr0saBUJPyUjAtV'];
      const playlist = playlists[Math.floor(Math.random() * playlists.length)];

      

      axios('https://accounts.spotify.com/api/token', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`),
        },
        data: 'grant_type=client_credentials',
        method: 'POST',
      })
        .then(tokenResponse => {
          const token = tokenResponse.data.access_token;

          axios(`https://api.spotify.com/v1/playlists/${playlist}/tracks?limit=100`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
            .then(tracksResponse => {
              const tracks = tracksResponse.data.items;
              const track = tracks[Math.floor(Math.random() * tracks.length)].track;

              this.song = `${track.name} - ${track.artists[0].name}`;
              this.artist = track.artists[0].name;
              this.spotify_url = track.external_urls.spotify;


              this.animateLetters();
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
    } else {
      // Password is incorrect, show an error message and don't load the content
      alert('Incorrect password. Please try again.');
      window.location.href = 'https://preview.redd.it/xkxrfo4cqys41.png?auto=webp&s=e74d64913a225ee841d26cd93df30ed6afc77666';
    }
  }

  animateLetters() {
    const textWrapper = document.querySelector('.ml10 .letters');
    if (textWrapper?.textContent) {
      textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");
    }
  
    anime.timeline({loop: false})
      .add({
        targets: '.ml10 .letter',
        rotateY: [-90, 0],
        duration: 1300,
        delay: (el, i) => 45 * i
      }).add({
        targets: '.ml10',
        opacity: [0,1],
        duration: 1000,
        easing: "easeOutExpo",
        delay: 1000
      });
  }
  
  
}
