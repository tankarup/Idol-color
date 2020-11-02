
let quiz_list = [];
let quiz_index = 0;
let quiz_scores = [];


const titles = [
  //['シンデレラガールズ', 'CinderellaGirls', 'cg'],
  //['Side M', '315ProIdols', 'sm'],
  ['765プロAS', '765AS', 'as'],
  //['シャイニーカラーズ', '283Pro', 'sc'],
  ['Team.Stella', 'Stella', ''],
  ['Team.Luna', 'Luna', ''],
  ['Team.Sol', 'Sol', ''],
  ['Princess Stars', 'Princess', ''],
  ['Fairy Stars', 'Fairy', 'mlf'],
  ['Angel Stars', 'Angel', 'mla'],

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
    //ボタンの表示切替
    $('#btn-check').css('visibility', 'hidden');
    $('#btn-next').css('visibility', 'visible');

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

  //最後まで到達していたら、アラートウィンドウに結果を表示して終了
  if (quiz_index > quiz_list.length-1){
    const group = $('input[name=game_title]:checked').val();
    let group_label = '';
    for (let title of titles){
      if (title[1] == group) group_label = title[0];
    }

    const score = $(`#result-average`).text();

    alert(`あなたの${group_label}イメージカラー記憶力は${score}点でした。`);

    return;
  }
  set_idol(quiz_index);
  
}

function set_idol(index){
  const idol = quiz_list[index];

  $(function () {
    $("#idol_image").attr({"src": `icons/${idol['id']}.png`,});
  });

  //ボタンの表示切替
  $('#btn-check').css('visibility', 'visible');
  $('#btn-next').css('visibility', 'hidden');

  $("#her_color").css("z-index", "-1");
  

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

const idols = [{'No': '1',
'color': '#e22b30',
'group': '765AS',
'id': 'haruka',
'label': '天海春香',
'shortname': '春香',
'title': '765AS'},
{'No': '2',
'color': '#2743d2',
'group': '765AS',
'id': 'chihaya',
'label': '如月千早',
'shortname': '千早',
'title': '765AS'},
{'No': '3',
'color': '#b4e04b',
'group': '765AS',
'id': 'miki',
'label': '星井美希',
'shortname': '美希',
'title': '765AS'},
{'No': '4',
'color': '#d3dde9',
'group': '765AS',
'id': 'yukiho',
'label': '萩原雪歩',
'shortname': '雪歩',
'title': '765AS'},
{'No': '5',
'color': '#f39939',
'group': '765AS',
'id': 'yayoi',
'label': '高槻やよい',
'shortname': 'やよい',
'title': '765AS'},
{'No': '6',
'color': '#515558',
'group': '765AS',
'id': 'makoto',
'label': '菊地真',
'shortname': '真',
'title': '765AS'},
{'No': '7',
'color': '#fd99e1',
'group': '765AS',
'id': 'iori',
'label': '水瀬伊織',
'shortname': '伊織',
'title': '765AS'},
{'No': '8',
'color': '#a6126a',
'group': '765AS',
'id': 'takane',
'label': '四条貴音',
'shortname': '貴音',
'title': '765AS'},
{'No': '9',
'color': '#01a860',
'group': '765AS',
'id': 'ritsuko',
'label': '秋月律子',
'shortname': '律子',
'title': '765AS'},
{'No': '10',
'color': '#9238be',
'group': '765AS',
'id': 'azusa',
'label': '三浦あずさ',
'shortname': 'あずさ',
'title': '765AS'},
{'No': '11',
'color': '#ffe43f',
'group': '765AS',
'id': 'ami',
'label': '双海亜美',
'shortname': '亜美',
'title': '765AS'},
{'No': '12',
'color': '#ffe43e',
'group': '765AS',
'id': 'mami',
'label': '双海真美',
'shortname': '真美',
'title': '765AS'},
{'No': '13',
'color': '#01adb9',
'group': '765AS',
'id': 'hibiki',
'label': '我那覇響',
'shortname': '響',
'title': '765AS'},
{'No': '14',
'color': '#ea5b76',
'group': 'Princess',
'id': 'mirai',
'label': '春日未来',
'shortname': '未来',
'title': 'MillionStars'},
{'No': '15',
'color': '#6495cf',
'group': 'Fairy',
'id': 'shizuka',
'label': '最上静香',
'shortname': '静香',
'title': 'MillionStars'},
{'No': '16',
'color': '#fed552',
'group': 'Angel',
'id': 'tsubasa',
'label': '伊吹翼',
'shortname': '翼',
'title': 'MillionStars'},
{'No': '17',
'color': '#92cfbb',
'group': 'Princess',
'id': 'kotoha',
'label': '田中琴葉',
'shortname': '琴葉',
'title': 'MillionStars'},
{'No': '18',
'color': '#9bce92',
'group': 'Angel',
'id': 'elena',
'label': '島原エレナ',
'shortname': 'エレナ',
'title': 'MillionStars'},
{'No': '19',
'color': '#58a6dc',
'group': 'Princess',
'id': 'minako',
'label': '佐竹美奈子',
'shortname': '美奈子',
'title': 'MillionStars'},
{'No': '20',
'color': '#454341',
'group': 'Fairy',
'id': 'megumi',
'label': '所恵美',
'shortname': '恵美',
'title': 'MillionStars'},
{'No': '21',
'color': '#5abfb7',
'group': 'Princess',
'id': 'matsuri',
'label': '徳川まつり',
'shortname': 'まつり',
'title': 'MillionStars'},
{'No': '22',
'color': '#ed90ba',
'group': 'Angel',
'id': 'serika',
'label': '箱崎星梨花',
'shortname': '星梨花',
'title': 'MillionStars'},
{'No': '23',
'color': '#eb613f',
'group': 'Angel',
'id': 'akane',
'label': '野々原茜',
'shortname': '茜',
'title': 'MillionStars'},
{'No': '24',
'color': '#7e6ca8',
'group': 'Angel',
'id': 'anna',
'label': '望月杏奈',
'shortname': '杏奈',
'title': 'MillionStars'},
{'No': '25',
'color': '#fff03c',
'group': 'Fairy',
'id': 'roco',
'label': 'ロコ',
'shortname': 'ロコ',
'title': 'MillionStars'},
{'No': '26',
'color': '#c7b83c',
'group': 'Princess',
'id': 'yuriko',
'label': '七尾百合子',
'shortname': '百合子',
'title': 'MillionStars'},
{'No': '27',
'color': '#7f6575',
'group': 'Princess',
'id': 'sayoko',
'label': '高山紗代子',
'shortname': '紗代子',
'title': 'MillionStars'},
{'No': '28',
'color': '#b54461',
'group': 'Princess',
'id': 'arisa',
'label': '松田亜利沙',
'shortname': '亜利沙',
'title': 'MillionStars'},
{'No': '29',
'color': '#e9739b',
'group': 'Princess',
'id': 'umi',
'label': '高坂海美',
'shortname': '海美',
'title': 'MillionStars'},
{'No': '30',
'color': '#f7e78e',
'group': 'Princess',
'id': 'iku',
'label': '中谷育',
'shortname': '育',
'title': 'MillionStars'},
{'No': '31',
'color': '#bee3e3',
'group': 'Fairy',
'id': 'tomoka',
'label': '天空橋朋花',
'shortname': '朋花',
'title': 'MillionStars'},
{'No': '32',
'color': '#554171',
'group': 'Princess',
'id': 'emily',
'label': 'エミリー',
'shortname': 'エミリー',
'title': 'MillionStars'},
{'No': '33',
'color': '#afa690',
'group': 'Fairy',
'id': 'shiho',
'label': '北沢志保',
'shortname': '志保',
'title': 'MillionStars'},
{'No': '34',
'color': '#e25a9b',
'group': 'Fairy',
'id': 'ayumu',
'label': '舞浜歩',
'shortname': '歩',
'title': 'MillionStars'},
{'No': '35',
'color': '#d1342c',
'group': 'Angel',
'id': 'hinata',
'label': '木下ひなた',
'shortname': 'ひなた',
'title': 'MillionStars'},
{'No': '36',
'color': '#f5ad3b',
'group': 'Princess',
'id': 'kana',
'label': '矢吹可奈',
'shortname': '可奈',
'title': 'MillionStars'},
{'No': '37',
'color': '#788bc5',
'group': 'Princess',
'id': 'nao',
'label': '横山奈緒',
'shortname': '奈緒',
'title': 'MillionStars'},
{'No': '38',
'color': '#f19557',
'group': 'Fairy',
'id': 'chizuru',
'label': '二階堂千鶴',
'shortname': '千鶴',
'title': 'MillionStars'},
{'No': '39',
'color': '#f1becb',
'group': 'Angel',
'id': 'konomi',
'label': '馬場このみ',
'shortname': 'このみ',
'title': 'MillionStars'},
{'No': '40',
'color': '#ee762e',
'group': 'Angel',
'id': 'tamaki',
'label': '大神環',
'shortname': '環',
'title': 'MillionStars'},
{'No': '41',
'color': '#7278a8',
'group': 'Angel',
'id': 'fuka',
'label': '豊川風花',
'shortname': '風花',
'title': 'MillionStars'},
{'No': '42',
'color': '#d7a96b',
'group': 'Angel',
'id': 'miya',
'label': '宮尾美也',
'shortname': '美也',
'title': 'MillionStars'},
{'No': '43',
'color': '#eceb70',
'group': 'Princess',
'id': 'noriko',
'label': '福田のり子',
'shortname': 'のり子',
'title': 'MillionStars'},
{'No': '44',
'color': '#99b7dc',
'group': 'Fairy',
'id': 'mizuki',
'label': '真壁瑞希',
'shortname': '瑞希',
'title': 'MillionStars'},
{'No': '45',
'color': '#b63b40',
'group': 'Angel',
'id': 'karen',
'label': '篠宮可憐',
'shortname': '可憐',
'title': 'MillionStars'},
{'No': '46',
'color': '#f19591',
'group': 'Fairy',
'id': 'rio',
'label': '百瀬莉緒',
'shortname': '莉緒',
'title': 'MillionStars'},
{'No': '47',
'color': '#aeb49c',
'group': 'Fairy',
'id': 'subaru',
'label': '永吉昴',
'shortname': '昴',
'title': 'MillionStars'},
{'No': '48',
'color': '#6bb6b0',
'group': 'Angel',
'id': 'reika',
'label': '北上麗花',
'shortname': '麗花',
'title': 'MillionStars'},
{'No': '49',
'color': '#efb864',
'group': 'Fairy',
'id': 'momoko',
'label': '周防桃子',
'shortname': '桃子',
'title': 'MillionStars'},
{'No': '50',
'color': '#d7385f',
'group': 'Fairy',
'id': 'julia',
'label': 'ジュリア',
'shortname': 'ジュリア',
'title': 'MillionStars'},
{'No': '51',
'color': '#ebe1ff',
'group': 'Fairy',
'id': 'tsumugi',
'label': '白石紬',
'shortname': '紬',
'title': 'MillionStars'},
{'No': '52',
'color': '#274079',
'group': 'Angel',
'id': 'kaori',
'label': '桜守歌織',
'shortname': '歌織',
'title': 'MillionStars'},
{'No': '53',
'color': '#ffbad6',
'group': 'Stella',
'id': 'mano',
'label': '櫻木真乃',
'shortname': '真乃',
'title': '283Pro'},
{'No': '54',
'color': '#144384',
'group': 'Luna',
'id': 'hiori',
'label': '風野灯織',
'shortname': '灯織',
'title': '283Pro'},
{'No': '55',
'color': '#ffe012',
'group': 'Sol',
'id': 'meguru',
'label': '八宮めぐる',
'shortname': 'めぐる',
'title': '283Pro'},
{'No': '56',
'color': '#f84cad',
'group': 'Stella',
'id': 'kogane',
'label': '月岡恋鐘',
'shortname': '恋鐘',
'title': '283Pro'},
{'No': '57',
'color': '#a846fb',
'group': 'Luna',
'id': 'mamimi',
'label': '田中摩美々',
'shortname': '摩美々',
'title': '283Pro'},
{'No': '58',
'color': '#006047',
'group': 'Sol',
'id': 'sakuya',
'label': '白瀬咲耶',
'shortname': '咲耶',
'title': '283Pro'},
{'No': '59',
'color': '#3b91c4',
'group': 'Luna',
'id': 'yuika',
'label': '三峰結華',
'shortname': '結華',
'title': '283Pro'},
{'No': '60',
'color': '#d9f2ff',
'group': 'Luna',
'id': 'kiriko',
'label': '幽谷霧子',
'shortname': '霧子',
'title': '283Pro'},
{'No': '61',
'color': '#e5461c',
'group': 'Stella',
'id': 'kaho',
'label': '小宮果穂',
'shortname': '果穂',
'title': '283Pro'},
{'No': '62',
'color': '#f93b90',
'group': 'Stella',
'id': 'chiyoko',
'label': '園田智代子',
'shortname': '智代子',
'title': '283Pro'},
{'No': '63',
'color': '#ffc602',
'group': 'Sol',
'id': 'juri',
'label': '西城樹里',
'shortname': '樹里',
'title': '283Pro'},
{'No': '64',
'color': '#89c3eb',
'group': 'Luna',
'id': 'rinze',
'label': '杜野凛世',
'shortname': '凛世',
'title': '283Pro'},
{'No': '65',
'color': '#90e667',
'group': 'Sol',
'id': 'natsuha',
'label': '有栖川夏葉',
'shortname': '夏葉',
'title': '283Pro'},
{'No': '66',
'color': '#f54275',
'group': 'Stella',
'id': 'amana',
'label': '大崎甘奈',
'shortname': '甘奈',
'title': '283Pro'},
{'No': '67',
'color': '#e75bec',
'group': 'Luna',
'id': 'tenka',
'label': '大崎甜花',
'shortname': '甜花',
'title': '283Pro'},
{'No': '68',
'color': '#fbfafa',
'group': 'Sol',
'id': 'chiyuki',
'label': '桑山千雪',
'shortname': '千雪',
'title': '283Pro'},
{'No': '69',
'color': '#f30100',
'group': 'Stella',
'id': 'asahi',
'label': '芹沢あさひ',
'shortname': 'あさひ',
'title': '283Pro'},
{'No': '70',
'color': '#5ce626',
'group': 'Sol',
'id': 'fuyuko',
'label': '黛冬優子',
'shortname': '優子',
'title': '283Pro'},
{'No': '71',
'color': '#ff00ff',
'group': 'Luna',
'id': 'mei',
'label': '和泉愛依',
'shortname': '愛依',
'title': '283Pro'},
{'No': '72',
'color': '#50d0d0',
'group': 'Sol',
'id': 'toru',
'label': '浅倉透',
'shortname': '透',
'title': '283Pro'},
{'No': '73',
'color': '#be1e3e',
'group': 'Stella',
'id': 'madoka',
'label': '樋口円香',
'shortname': '円香',
'title': '283Pro'},
{'No': '74',
'color': '#7967c3',
'group': 'Luna',
'id': 'koito',
'label': '福丸小糸',
'shortname': '小糸',
'title': '283Pro'},
{'No': '75',
'color': '#ffc639',
'group': 'Sol',
'id': 'hinana',
'label': '市川雛菜',
'shortname': '雛菜',
'title': '283Pro'}];