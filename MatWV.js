function MatWV(nCol,nLin) { // Constructeur: Matrice à coefficients réels
   this.nC=nCol;                // nombre de colonnes
   this.nL=nLin;                // nombre de lignes
   this.M=new Array(nCol*nLin); // valeurs ligne par ligne
} // http://fr.wikipedia.org/wiki/Matrice_(math%C3%A9matiques)

//============================================================================
// Méthodes d'instance qui ne modifient pas la matrice concernée:

MatWV.prototype.Copy=function() { // Crée une copie (clone) de la matrice
   var m=new MatWV(this.nL,this.nC),NN=this.M.length;
   for (var i=0;i<NN;i++) m.M[i]=this.M[i];
   return m;
}

MatWV.prototype.Det=function() { // Calcule le déterminant de la matrice
   var d=1,e,h,hN,k,kN,i,j,jN,N=this.nC,p,m=this.M.slice(0);
   if (N!=this.nL) return 0; // seulement pour matrices carrées
   for (k=N-1,kN=k*N;k>0;k--,kN-=N) {
      for (j=0,h=k,p=0;j<=k;j++) if ((e=Math.abs(m[k+j*N]))>p) {h=j; p=e;}
      if (h!=k) { // permutation des linges h et k
         hN=h*N; d=-d; // inversion du signe;
         for (i=0;i<=k;i++) {e=m[i+hN]; m[i+hN]=m[i+kN]; m[i+kN]=e;}
      }
      if ((!isFinite(d*=(e=m[k+kN])))||(d==0)) return d;
      for (j=0,jN=0;j<k;j++,jN+=N) // pour chaque ligne (sauf la dernière)
         for (i=0,f=m[k+jN]/e;i<k;i++) m[i+jN]-=f*m[i+kN];
   }
   return d*m[0];
} // http://fr.wikipedia.org/wiki/D%C3%A9terminant_(math%C3%A9matiques)

MatWV.prototype.EcartI=function() { // Ecart abs max de this par rapport à la matrice unité
   var a,e=0,m=this.M,N=1+this.nC,NN=m.length;
   for (var i=0;i<NN;i++) if ((a=Math.abs(((i%N)==0)?1-m[i]:m[i]))>e) e=a;
   return e;
}

MatWV.prototype.Inv=function() { // Crée la matrice inverse de this
   var mi=this.Copy(); return (mi.Invert()!=0)?mi:null;
}

MatWV.prototype.Norm=function() { // Norme d'un vecteur
   if ((this.nC>1)&&(this.nL>1)) return 0; // seulement pour vecteurs
   var i,NN=this.M.length,s=0;
   for (i=0;i<NN;i++) s+=this.M[i]*this.M[i];
   return Math.sqrt(s);
}

MatWV.prototype.Prod=function(r) { // Crée la matrice produit: Prod = this * r
   var m=this.M,tC=this.nC,tL=this.nL,rC=r.nC,rL=r.nL;
   if (tC!=rL) return null;
   var i,l,lt,k=0,c,p=new MatWV(rC,tL),s;
   for (l=0;l<tL;l++) {
      for (c=0,lt=l*tC;c<rC;c++) {
         for (i=0,s=0;i<tC;i++) s+=m[lt+i]*r.M[c+i*rC];
         p.M[k++]=s;
      }
   }
   return p;
} // http://fr.wikipedia.org/wiki/Produit_matriciel

MatWV.prototype.Str=function(sep,eol) { // Crée un string de la matrice 'arrondie'
   var i,q=this.nC,NN=q*this.nL,s=eol;  // avec séparateurs de valeurs et de lignes
   for (i=0;i<NN;i++) s+=Math.round(this.M[i]*1000000)/1000000+(((i+1)%q)?sep:eol);
   return s; // sans arrondi: ... s+=this.M[i]+(((i+1)%q)?sep:eol);
}

MatWV.prototype.Sum=function(a) { // Crée la matrice somme: Sum = this + a
   if ((this.nC!=a.nC)||(this.nL!=a.nL)) return null;
   var m=new MatWV(this.nC,this.nL);
   for (var i=0;i<this.M.length;i++) m.M[i]=this.M[i]+a.M[i];
   return m;
} // http://fr.wikipedia.org/wiki/Addition_matricielle
 
MatWV.prototype.Transp=function() { // Crée la matrice transposée
   var m=new MatWV(this.nL,this.nC);
   for (var l=0;l<this.nL;l++) 
      for (var c=0;c<this.nC;c++) m.M[l+c*this.nL]=this.M[c+l*this.nC];
   return m;
} // http://fr.wikipedia.org/wiki/Matrice_transpos%C3%A9e
//============================================================================
// Méthodes d'instance qui modifient la matrice concernée:

MatWV.prototype.Const=function() { // Multiplie this par la constante k
   for (var i=0;i<this.nC*this.nL;i++) this.M[i]*=k;
}

MatWV.prototype.Invert=function() { // Inverse la matrice this sur elle-même
   var d=1,e,h,hh,ii,j,k,kk=0,m=this.M,N=this.nC,NN=N*N,p,idx=new Array(N);
   if (N!=this.nL) return 0; // Seulement pour matrice carrée
   for (k=0;k<N;k++,kk+=N) {
      for (j=k,p=0;j<N;j++) if ((e=Math.abs(m[j*N+k]))>p) {p=e; h=j;}
      if (p==0) return 0; // meilleur pivot = 0 ==> déterminant = 0
      idx[k]=h; hh=h*N; p=m[hh+k]; d*=(h==k)?p:-p; m[hh+k]=m[kk+k]; m[kk+k]=1;
      for (ii=k;ii<NN;ii+=N) m[ii]/=p;
      for (j=0;j<N;j++) if (k!=j) {
         e=m[hh+j]; m[hh+j]=m[kk+j]; m[kk+j]=0;
         if (e!=0) for (ii=0;ii<NN;ii+=N) m[ii+j]-=e*m[ii+k];
      }
   }
   for (j=N-1;j>=0;j--) // on réarrange les colonnes
      for (ii=0,h=idx[j];ii<NN;ii+=N) {e=m[ii+h]; m[ii+h]=m[ii+j]; m[ii+j]=e;}
   return d; // retourne le déterminant
} // http://fr.wikipedia.org/wiki/Matrice_inversible

//============================================================================
// Les méthodes suivantes sont 'statiques':

MatWV.Rnd=function(nC,nL,lim,dig) { // Crée une matrice 'aléatoire' à valeurs entre -lim et lim
   var m=new MatWV(nC,nL),lim2=2*lim,d=[1,10,100,1000,10000][dig];
   for (var i=0;i<nC*nL;i++) m.M[i]=Math.round(d*(lim-lim2*Math.random()))/d;
   return m; // valeurs arrondies à 'dig' chiffres après la virgule (0<=dig<4)
}

MatWV.Uni=function(n) { // Crée la matrice unité n*n
   var m=new MatWV(n,n);
   for (var i=0;i<n*n;i++) m.M[i]=(i%(n+1))?0:1;
   return m;
} // http://fr.wikipedia.org/wiki/Matrice_unit%C3%A9

// ODJO Essèho Urbain, Bénin, Mars 2023
