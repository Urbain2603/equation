// Presse-papier: extension à 'MatWV.js'

MatWV.prototype.SetCb=function() { // écrit les nombres de la matrice dans le presse-papier
  window.clipboardData.setData("Text",this.Str(',','\r\n'));
}

MatWV.prototype.GetCb=function() { // lit les nombres de la matrice depuis le presse-papier
  var i,k,n=this.nC*this.nL,s=window.clipboardData.getData('Text');
  for (i=0;i<n;i++) { // scanne et lit les nombres
    if ((k=s.search(/[0123456789-]/))<0)
      {alert('seulement '+i+' / '+n+' nombres dans le presse-papier'); return null;}
    s=s.substr(k); this.M[i]=(parseFloat(s));
    if ((k=s.search(/[ ,\t\r\n]/))>0) s=s.substr(k);
  }
}
// ODJO Essèho Urbain, Bénin, Mars 2023
