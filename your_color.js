
let quiz_list = [];
let quiz_index = 0;
let quiz_scores = [];


const titles = [
  //['シンデレラガールズ', 'CinderellaGirls', 'cg'],
  //['Side M', '315ProIdols', 'sm'],
  ['765プロAS', '765AS', 'as'],
  ['シャイニーカラーズ', '283Pro', 'sc'],
  ['ミリオンライブ！プリンセス', 'MillionStarsP', 'mlp'],
  ['ミリオンライブ！フェアリー', 'MillionStarsF', 'mlf'],
  ['ミリオンライブ！エンジェル', 'MillionStarsA', 'mla'],

];


  

// 配列をシャッフル
function shuffle(array) {
  for (let i = array.length - 1; i >= 0; i--) {
    let rand = Math.floor(Math.random() * (i + 1));
    // 配列の数値を入れ替える
    [array[i], array[rand]] = [array[rand], array[i]]
  }
  return array;
}

//アイドルを指定した事務所でフィルタリング。リストになければ全事務所が対象
function filter_by_title(idols, title){
  let title_keys = [];
  for (let i = 0; i < titles.length; i++){
    title_keys.push(titles[i][1]);
  }
  if (title_keys.indexOf(title) > -1){
    return idols.filter(idol => idol['group'] == title);
  } else {
    return idols;
  }
  
}

function filter_by_key(idols, key){
  return idols.filter(idol => idol[key]);
}
//https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(mino, maxo) {
  const min = Math.ceil(mino);
  const max = Math.floor(maxo);
  const r = Math.floor(Math.random() * (max - min + 1)) + min;
  //console.log(r, min, max);

  return r; //The maximum is inclusive and the minimum is inclusive 
}

function init_options(){
  //事務所一覧をメニュー表示
  let title_selection = '';
  for (let i = 0; i < titles.length; i++){
    const title = titles[i];
    const checked = i == 0 ? 'checked="checked"': ''

    title_selection += `
      <span style="white-space: nowrap;">
        <input type="radio" id="${title[2]}" name="game_title" value="${title[1]}" ${checked}>
        <label for="${title[2]}">${title[0]}</label>
      </span>
    `;
  }
  document.getElementById("title_selection").innerHTML = title_selection;

  $(function(){
    $('input').change( function() {refresh_list();});
  });

}

function refresh_list(){

  //出題リストを初期化
  quiz_list = get_idols_by_selected_title();
  quiz_index = 0;

  //結果表示欄に出題リストを表示
  let results_html = '';
  results_html += `<table>`;
  results_html += `
    <tr>
      <th>アイドル</th>
      <th>回答色</th>
      <th>正解色</th>
      <th>スコア</th>
    </tr>`;
  for (let i = 0; i < quiz_list.length; i++){
    const idol = quiz_list[i];
    results_html += `
      <tr>
        <td id="result-img-${i}" valign="center" align="center"><img src="icons/${idol['id']}.png" width="50px" height="50px"></td>
        <td id="result-your-${i}" style="height: 50px; width: 50px;"></td>
        <td id="result-her-${i}" style="height: 50px; width: 50px;"></td>
        <td id="result-score-${i}" valign="center" align="center"></td>
      </tr>`;
  }
  results_html += `
  <tr style="font-weight:bold; text-align:center;">
    <td>平均</td>
    <td>-</td>
    <td>-</td>
    <td id="result-average" ></td>
  </tr>`;
  results_html += `</table>`;

  $(function(){
    $('#results').html(results_html);
  });

  set_idol(quiz_index);

  //スコアを初期化
  quiz_scores = Array(quiz_list.length);


}


function get_idols_by_selected_title(){
  let title, filtered_idols;
  
  title = $('input[name=game_title]:checked').val();
  filtered_idols = filter_by_title(idols, title);

  return filtered_idols;
}

function average_score(scores){
  let score_sum = 0;
  let score_num = 0;
  for (let score of scores){
    if (score){
      score_sum += score;
      score_num++;
    }
  }
  return Math.ceil(score_sum/score_num);
}

function btn_check(){
  $(function () {
    const idol = quiz_list[quiz_index];

    const your_color = $("#your_color").css("background-color");

    const her_color = idol['color'];
    $('#her_color').css({'background-color': her_color});
    $("#her_color").css({
      "z-index": "1",
    });

    
    //console.log(her_color, your_color);
    const score = get_score(her_color, your_color);
    show_score(score);
    quiz_scores[quiz_index] = score;

    $(`#result-her-${quiz_index}`).css({'background-color': her_color});
    $(`#result-your-${quiz_index}`).css({'background-color': your_color});
    $(`#result-score-${quiz_index}`).text(score);
    
    $(`#result-average`).text(average_score(quiz_scores));
    
  });

  
}

const de_max = chroma.deltaE('white', 'black');
console.log('de max: ', de_max)

function get_score(color1, color2){
  const de = chroma.deltaE(color1, color2);
  let r = Math.max(1-de/100,0); //0~1規格化スコア
  r = r*r;//2乗にして差異を強調

  return Math.floor(r*100);
}

function show_score(score){
  $(function () {
    $("#score").text('スコア: ' + score);
  });
}

function init_color_picker(){
  //colorPicker.color.hsv = {h: getRandomInt(0,360), s: getRandomInt(50,100), v: 100};
  colorPicker.color.hexString = '#ddd'
}

function btn_next(){
  quiz_index++;
  set_idol(quiz_index);
  $("#her_color").css("z-index", "-1");
}

function set_idol(index){
  const idol = quiz_list[index];

  $(function () {
    $("#idol_image").attr({"src": `icons/${idol['id']}.png`,});
  });
  

}

function test(){
  const color1 = chroma('#D4F880');
  const color2 = chroma('#abcabc');
  const de = chroma.deltaE(color1, color2);

  console.log(de);
}

function init(){

  init_options();
  init_color_picker();
  refresh_list();

}

const colorPicker = new iro.ColorPicker('#picker',{
  color: '#fff',
  borderColor: '#ddd',
  borderWidth: 3,
  handleRadius: 20,
  //sliderSize: 50,
});

colorPicker.on('color:change', function(color) {
  // log the current color as a HEX string
  $(function () {
    $("#your_color").css({"background-color": color.hexString,});
  });

  
});

const idols = [{'color': '#e22b30',
'group': '765AS',
'id': 'haruka',
'label': '天海春香',
'shortname': '春香',
'title': '765AS',
'type': 'P'},
{'color': '#2743d2',
'group': '765AS',
'id': 'chihaya',
'label': '如月千早',
'shortname': '千早',
'title': '765AS',
'type': 'F'},
{'color': '#b4e04b',
'group': '765AS',
'id': 'miki',
'label': '星井美希',
'shortname': '美希',
'title': '765AS',
'type': 'A'},
{'color': '#d3dde9',
'group': '765AS',
'id': 'yukiho',
'label': '萩原雪歩',
'shortname': '雪歩',
'title': '765AS',
'type': 'P'},
{'color': '#f39939',
'group': '765AS',
'id': 'yayoi',
'label': '高槻やよい',
'shortname': 'やよい',
'title': '765AS',
'type': 'A'},
{'color': '#515558',
'group': '765AS',
'id': 'makoto',
'label': '菊地真',
'shortname': '真',
'title': '765AS',
'type': 'P'},
{'color': '#fd99e1',
'group': '765AS',
'id': 'iori',
'label': '水瀬伊織',
'shortname': '伊織',
'title': '765AS',
'type': 'F'},
{'color': '#a6126a',
'group': '765AS',
'id': 'takane',
'label': '四条貴音',
'shortname': '貴音',
'title': '765AS',
'type': 'F'},
{'color': '#01a860',
'group': '765AS',
'id': 'ritsuko',
'label': '秋月律子',
'shortname': '律子',
'title': '765AS',
'type': 'F'},
{'color': '#9238be',
'group': '765AS',
'id': 'azusa',
'label': '三浦あずさ',
'shortname': 'あずさ',
'title': '765AS',
'type': 'A'},
{'color': '#ffe43f',
'group': '765AS',
'id': 'ami',
'label': '双海亜美',
'shortname': '亜美',
'title': '765AS',
'type': 'A'},
{'color': '#ffe43e',
'group': '765AS',
'id': 'mami',
'label': '双海真美',
'shortname': '真美',
'title': '765AS',
'type': 'A'},
{'color': '#01adb9',
'group': '765AS',
'id': 'hibiki',
'label': '我那覇響',
'shortname': '響',
'title': '765AS',
'type': 'P'},
{'color': '#ea5b76',
'group': 'MillionStarsP',
'id': 'mirai',
'label': '春日未来',
'shortname': '未来',
'title': 'MillionStars',
'type': 'P'},
{'color': '#6495cf',
'group': 'MillionStarsF',
'id': 'shizuka',
'label': '最上静香',
'shortname': '静香',
'title': 'MillionStars',
'type': 'F'},
{'color': '#fed552',
'group': 'MillionStarsA',
'id': 'tsubasa',
'label': '伊吹翼',
'shortname': '翼',
'title': 'MillionStars',
'type': 'A'},
{'color': '#92cfbb',
'group': 'MillionStarsP',
'id': 'kotoha',
'label': '田中琴葉',
'shortname': '琴葉',
'title': 'MillionStars',
'type': 'P'},
{'color': '#9bce92',
'group': 'MillionStarsA',
'id': 'elena',
'label': '島原エレナ',
'shortname': 'エレナ',
'title': 'MillionStars',
'type': 'A'},
{'color': '#58a6dc',
'group': 'MillionStarsP',
'id': 'minako',
'label': '佐竹美奈子',
'shortname': '美奈子',
'title': 'MillionStars',
'type': 'P'},
{'color': '#454341',
'group': 'MillionStarsF',
'id': 'megumi',
'label': '所恵美',
'shortname': '恵美',
'title': 'MillionStars',
'type': 'F'},
{'color': '#5abfb7',
'group': 'MillionStarsP',
'id': 'matsuri',
'label': '徳川まつり',
'shortname': 'まつり',
'title': 'MillionStars',
'type': 'P'},
{'color': '#ed90ba',
'group': 'MillionStarsA',
'id': 'serika',
'label': '箱崎星梨花',
'shortname': '星梨花',
'title': 'MillionStars',
'type': 'A'},
{'color': '#eb613f',
'group': 'MillionStarsA',
'id': 'akane',
'label': '野々原茜',
'shortname': '茜',
'title': 'MillionStars',
'type': 'A'},
{'color': '#7e6ca8',
'group': 'MillionStarsA',
'id': 'anna',
'label': '望月杏奈',
'shortname': '杏奈',
'title': 'MillionStars',
'type': 'A'},
{'color': '#fff03c',
'group': 'MillionStarsF',
'id': 'roco',
'label': 'ロコ',
'shortname': 'ロコ',
'title': 'MillionStars',
'type': 'F'},
{'color': '#c7b83c',
'group': 'MillionStarsP',
'id': 'yuriko',
'label': '七尾百合子',
'shortname': '百合子',
'title': 'MillionStars',
'type': 'P'},
{'color': '#7f6575',
'group': 'MillionStarsP',
'id': 'sayoko',
'label': '高山紗代子',
'shortname': '紗代子',
'title': 'MillionStars',
'type': 'P'},
{'color': '#b54461',
'group': 'MillionStarsP',
'id': 'arisa',
'label': '松田亜利沙',
'shortname': '亜利沙',
'title': 'MillionStars',
'type': 'P'},
{'color': '#e9739b',
'group': 'MillionStarsP',
'id': 'umi',
'label': '高坂海美',
'shortname': '海美',
'title': 'MillionStars',
'type': 'P'},
{'color': '#f7e78e',
'group': 'MillionStarsP',
'id': 'iku',
'label': '中谷育',
'shortname': '育',
'title': 'MillionStars',
'type': 'P'},
{'color': '#bee3e3',
'group': 'MillionStarsF',
'id': 'tomoka',
'label': '天空橋朋花',
'shortname': '朋花',
'title': 'MillionStars',
'type': 'F'},
{'color': '#554171',
'group': 'MillionStarsP',
'id': 'emily',
'label': 'エミリー',
'shortname': 'エミリー',
'title': 'MillionStars',
'type': 'P'},
{'color': '#afa690',
'group': 'MillionStarsF',
'id': 'shiho',
'label': '北沢志保',
'shortname': '志保',
'title': 'MillionStars',
'type': 'F'},
{'color': '#e25a9b',
'group': 'MillionStarsF',
'id': 'ayumu',
'label': '舞浜歩',
'shortname': '歩',
'title': 'MillionStars',
'type': 'F'},
{'color': '#d1342c',
'group': 'MillionStarsA',
'id': 'hinata',
'label': '木下ひなた',
'shortname': 'ひなた',
'title': 'MillionStars',
'type': 'A'},
{'color': '#f5ad3b',
'group': 'MillionStarsP',
'id': 'kana',
'label': '矢吹可奈',
'shortname': '可奈',
'title': 'MillionStars',
'type': 'P'},
{'color': '#788bc5',
'group': 'MillionStarsP',
'id': 'nao',
'label': '横山奈緒',
'shortname': '奈緒',
'title': 'MillionStars',
'type': 'P'},
{'color': '#f19557',
'group': 'MillionStarsF',
'id': 'chizuru',
'label': '二階堂千鶴',
'shortname': '千鶴',
'title': 'MillionStars',
'type': 'F'},
{'color': '#f1becb',
'group': 'MillionStarsA',
'id': 'konomi',
'label': '馬場このみ',
'shortname': 'このみ',
'title': 'MillionStars',
'type': 'A'},
{'color': '#ee762e',
'group': 'MillionStarsA',
'id': 'tamaki',
'label': '大神環',
'shortname': '環',
'title': 'MillionStars',
'type': 'A'},
{'color': '#7278a8',
'group': 'MillionStarsA',
'id': 'fuka',
'label': '豊川風花',
'shortname': '風花',
'title': 'MillionStars',
'type': 'A'},
{'color': '#d7a96b',
'group': 'MillionStarsA',
'id': 'miya',
'label': '宮尾美也',
'shortname': '美也',
'title': 'MillionStars',
'type': 'A'},
{'color': '#eceb70',
'group': 'MillionStarsP',
'id': 'noriko',
'label': '福田のり子',
'shortname': 'のり子',
'title': 'MillionStars',
'type': 'P'},
{'color': '#99b7dc',
'group': 'MillionStarsF',
'id': 'mizuki',
'label': '真壁瑞希',
'shortname': '瑞希',
'title': 'MillionStars',
'type': 'F'},
{'color': '#b63b40',
'group': 'MillionStarsA',
'id': 'karen',
'label': '篠宮可憐',
'shortname': '可憐',
'title': 'MillionStars',
'type': 'A'},
{'color': '#f19591',
'group': 'MillionStarsF',
'id': 'rio',
'label': '百瀬莉緒',
'shortname': '莉緒',
'title': 'MillionStars',
'type': 'F'},
{'color': '#aeb49c',
'group': 'MillionStarsF',
'id': 'subaru',
'label': '永吉昴',
'shortname': '昴',
'title': 'MillionStars',
'type': 'F'},
{'color': '#6bb6b0',
'group': 'MillionStarsA',
'id': 'reika',
'label': '北上麗花',
'shortname': '麗花',
'title': 'MillionStars',
'type': 'A'},
{'color': '#efb864',
'group': 'MillionStarsF',
'id': 'momoko',
'label': '周防桃子',
'shortname': '桃子',
'title': 'MillionStars',
'type': 'F'},
{'color': '#d7385f',
'group': 'MillionStarsF',
'id': 'julia',
'label': 'ジュリア',
'shortname': 'ジュリア',
'title': 'MillionStars',
'type': 'F'},
{'color': '#ebe1ff',
'group': 'MillionStarsF',
'id': 'tsumugi',
'label': '白石紬',
'shortname': '紬',
'title': 'MillionStars',
'type': 'F'},
{'color': '#274079',
'group': 'MillionStarsA',
'id': 'kaori',
'label': '桜守歌織',
'shortname': '歌織',
'title': 'MillionStars',
'type': 'A'},
{'color': '#ffbad6',
'group': '283Pro',
'id': 'mano',
'label': '櫻木真乃',
'shortname': '真乃',
'title': '283Pro',
'type': ''},
{'color': '#144384',
'group': '283Pro',
'id': 'hiori',
'label': '風野灯織',
'shortname': '灯織',
'title': '283Pro',
'type': ''},
{'color': '#ffe012',
'group': '283Pro',
'id': 'meguru',
'label': '八宮めぐる',
'shortname': 'めぐる',
'title': '283Pro',
'type': ''},
{'color': '#f84cad',
'group': '283Pro',
'id': 'kogane',
'label': '月岡恋鐘',
'shortname': '恋鐘',
'title': '283Pro',
'type': ''},
{'color': '#a846fb',
'group': '283Pro',
'id': 'mamimi',
'label': '田中摩美々',
'shortname': '摩美々',
'title': '283Pro',
'type': ''},
{'color': '#006047',
'group': '283Pro',
'id': 'sakuya',
'label': '白瀬咲耶',
'shortname': '咲耶',
'title': '283Pro',
'type': ''},
{'color': '#3b91c4',
'group': '283Pro',
'id': 'yuika',
'label': '三峰結華',
'shortname': '結華',
'title': '283Pro',
'type': ''},
{'color': '#d9f2ff',
'group': '283Pro',
'id': 'kiriko',
'label': '幽谷霧子',
'shortname': '霧子',
'title': '283Pro',
'type': ''},
{'color': '#e5461c',
'group': '283Pro',
'id': 'kaho',
'label': '小宮果穂',
'shortname': '果穂',
'title': '283Pro',
'type': ''},
{'color': '#f93b90',
'group': '283Pro',
'id': 'chiyoko',
'label': '園田智代子',
'shortname': '智代子',
'title': '283Pro',
'type': ''},
{'color': '#ffc602',
'group': '283Pro',
'id': 'juri',
'label': '西城樹里',
'shortname': '樹里',
'title': '283Pro',
'type': ''},
{'color': '#89c3eb',
'group': '283Pro',
'id': 'rinze',
'label': '杜野凛世',
'shortname': '凛世',
'title': '283Pro',
'type': ''},
{'color': '#90e667',
'group': '283Pro',
'id': 'natsuha',
'label': '有栖川夏葉',
'shortname': '夏葉',
'title': '283Pro',
'type': ''},
{'color': '#f54275',
'group': '283Pro',
'id': 'amana',
'label': '大崎甘奈',
'shortname': '甘奈',
'title': '283Pro',
'type': ''},
{'color': '#e75bec',
'group': '283Pro',
'id': 'tenka',
'label': '大崎甜花',
'shortname': '甜花',
'title': '283Pro',
'type': ''},
{'color': '#fbfafa',
'group': '283Pro',
'id': 'chiyuki',
'label': '桑山千雪',
'shortname': '千雪',
'title': '283Pro',
'type': ''},
{'color': '#f30100',
'group': '283Pro',
'id': 'asahi',
'label': '芹沢あさひ',
'shortname': 'あさひ',
'title': '283Pro',
'type': ''},
{'color': '#5ce626',
'group': '283Pro',
'id': 'fuyuko',
'label': '黛冬優子',
'shortname': '優子',
'title': '283Pro',
'type': ''},
{'color': '#ff00ff',
'group': '283Pro',
'id': 'mei',
'label': '和泉愛依',
'shortname': '愛依',
'title': '283Pro',
'type': ''},
{'color': '#50d0d0',
'group': '283Pro',
'id': 'toru',
'label': '浅倉透',
'shortname': '透',
'title': '283Pro',
'type': ''},
{'color': '#be1e3e',
'group': '283Pro',
'id': 'madoka',
'label': '樋口円香',
'shortname': '円香',
'title': '283Pro',
'type': ''},
{'color': '#7967c3',
'group': '283Pro',
'id': 'koito',
'label': '福丸小糸',
'shortname': '小糸',
'title': '283Pro',
'type': ''},
{'color': '#ffc639',
'group': '283Pro',
'id': 'hinana',
'label': '市川雛菜',
'shortname': '雛菜',
'title': '283Pro',
'type': ''}];