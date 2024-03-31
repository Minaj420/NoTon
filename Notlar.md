Simple note taking app.

#project

## NotoN

#NotoN

- İlk öğrencilik projem.

* Basit not alma uygulaması.

### Amaçlar

1. Uygulama arayüzünü oluşturma.
2. DOM arayüzüne not ekleme.
3. Eklenen notu kaydetme.
4. Kaydedilen notları sidebarda liste görünümünde gösterme.
5. Sidebarda listelenen notlar arasında navigasyon yapmak.
6. Notları silme
7. Silinen notları saklama - _trash bin_ özelliği.
8. Trash bin için kayan pencere düzenleme.
9. Trash bin'deki notları _restore_ etme.
10. Trash bin deki notların tamamını silme.
11. Tema oluşturma.
12. Temalar arasında geçiş yapma.
13. Arayüz geri bildirimini artırma.
14. Notlara pin özelliği ekleme.

### Geliştirme Süreci

#### Çözümler ve Öğrendiklerim

1. Kısıtlı CSS bilgisi ile projeye başladım. CSS flex öğrendiğim için tüm projede flex kullandım.
2. HTML input olarak `<textarea>` elementi kullanıldı.

- `<textarea>` attributeleri öğrenildi.

3. Notları oluştururken `title` ve `note` key'leri içeren objeler halinde kaydedildi.

- kayıt destinasyonu olarak appData adında bir obje oluşturuldu. notlar notestorage array'i içine kaydedildi.
- Kayıt alırken `if (!(note === ""))` gibi error check'ler kullanıldı.

4. Kaydedilen notların sidebarda gözükmesi için `elementInjectorTitle` adında bir fonksiyon oluşturuldu.

- Bu fonksiyon girilen notun başlığını alarak. sidebar üzerinde nested html elementleri yaratıyor.
- İleri süreçte `index` parametresi fonksiyona eklendi.
- `classlist.add()`, `document.createElement()`, `setAttribute()`, `innerHTML`, `appendChild()` metotları öğrenildi. fonksiyon içerisinde kullanıldı.

5. Sidebara eklenen notların presentasyonu üzerinden notlar arasında geçiş için `<li>` elementine eventlistener eklendi.

- Bu süreçte seçili notun bilgisi `index` adıyla `appData.noteIndex` içine pushlandı.
- Bu index bilgisi tıklanan `<li>` elementinin kaçıncı sırada olduğunu parent elementleri üzerinden alındı.

```js
sidebarOl.addEventListener("click", function (event) {

if (event.target.tagName === "LI") {

const index = Array.from(sidebarOl.children).indexOf(

event.target.parentElement

);
```

- `event.target.tagName` - `event.target.parentElement` selector olarak kullanmak öğrenildi.
- `Array.from()` metodu öğrenildi.

6. Notları geçici olarak silmek için notun kaydedildiği obje içerisinde `active` adında default olarak `false` gelen boolean verisi kullanıldı. Silme fonksiyonu bu key'i `true` çeviriyor.
7. Active değeri `true` olan notlar `updateSidebar()` fonksiyonu tarafından filter edilip `appData.deletedNotes` içerisine pushlanıyor.

- Trash bin içeriği `appData.deletedNotes` içeriğinden filtrelenerek oluşturuyor.

8. Kayan pencere için CSS `transition` öğrenildi. `fixed` position kullanıldı.
9. Restore için `active` değerini `false` çevirip listeyi update eden bir fonksiyon oluşturmak yeterli oldu.
10. Silinen notları temelli silme için `appData.noteStorage` içeriğinde `active` değeri `true` olan notları `filter()` metodu ile güncellendi.
11. Tema için CSS `root` içerisinde color variable oluşturma öğrenildi.

- Color variable'lar bir obje içerisine kaydedildi. bir `forEach()` metodu kullanan bir fonksiyon vasıtası ile root değerleri değiştirildi.

12. Tema geçişleri için renklerde CSS `transition:background-color` kullanıldı.
13. Arayüz içerisindeki düğmelerde geribildirimi artırmak amacıyla CSS `:hover` efektleri eklendi. `transition` değerleri tweak edildi.
14. Notlara pin özelliği eklendi.

- `updateSidebar()` fonksiyonu içerisine `dateSort()` adında bir fonksiyon daha eklendi. Bu fonksiyon aynı zamanda notların tarih bilgisini alarak sort işlemi gerçekleştiriyor. bookmark(yani pin) özelliği olan notlara öncelik tanıyor. Bu sayede pinned notlar en tepeye yerleşiyor.

> [!NOTE] `dateSort()` fonksiyonu üzerine
> Bu fonksiyon notların **yaratılma tarihini** ve eğer **varsa değiştirilme tarihini** alarak sıralama yapmak üzere tasarlandı. Daha sonra **pin** özelliği için fonksiyona exception eklendi. Pinli notların sıralaması için en son pinlen notun en üstte görünmesini istiyordum fakat gerçekleştiremedim. Pin için ayrı tarih bilgisi eklemek sorunu çözebilirdi ama uğraşmak istemedim. Bu haliyle de fonksiyon ediyor. Pinlerin sıralamasını belirleme özgürlüğümüz maalesef programın şu halinde mevcut değil.

---

#### Notlar

- Programın development sürecinde `index` ve `data-index` gibi bazı fikirleri chatGPT'den aldım. Genellikle soru-cevap şeklinde faydalanmaya çalıştım. GPT'ye kodlama yaptırmamaya özen gösterdim. Eğer GPT'den kod implemente edeceksem de çalışma mantığını özümsemeye çalışarak devam ettim. İlk projem olduğu için bocaladığım zamanlar çok oldu fakat sürecin tamamını ele aldığımda faydalı bir iş oldu. Üstelik ortaya çıkan iş üç aşağı beş yukarı planladığım gibi oldu.
- Sürecin en başında karşıma çıkan problemlere üzerine fazla düşünmeden hemen sorunu çözmeye odaklı çözümler getirdim. Programa yeni feature ekledikçe bu yamadığım yerler sorun çıkarmaya başladı. İlk haftanın sonunda kodlarımı düzeltmeye çalışmaktan vazgeçip daha sağlam bir temele oturtmaya çalıştım. Bu yüzden silip en baştan yazmaya başladım.
- Herhangi bir programlama paradigması henüz öğrenmedim. Tamamen içgüdüsel olarak yazıldı. Genel olarak fonksiyonlar oluşturup birbirine eklenmesi ile yazıldı.
