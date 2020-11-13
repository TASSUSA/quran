const initialize = function(){
	var verseCounts = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];

	var Suras = ["Al-Fatiha","Al-Baqara","Al-'Imran","An-Nisa'","Al-Ma'ida","Al-An'am","Al-A'raf","Al-Anfal","At-Tauba","Yunus","Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra'","Al-Kahf","Maryam","Ta-Ha","Al-Anbiyaa","Al-Hajj","Al-Mu’minun","An-Nur","Al-Furqan","Ash-Shu’ara’","An-Naml","Al-Qasas","Al-Ankabut","Ar-Rum","Luqman","As-Sajda","Al-Ahzâb","Saba'","Fátir","Ya-Si(e’)n","As-Saffát","Sád","Az-Zumar","Gháfer or Al- Mu’min","Ha-Mim or Ha-Mim Sajda","Ash-Shu’ra","Az-Zukhruf","Ad-Dukhán","Al-Játhiya","Al-Ahqáf","Muhammad","Al-Fath","Al-Hujurat","Qáf","Adh-Dháriyat","At-Túr","An-Najm","Al-Qamar","Ar-Rahmán","Al-Wáqi’ah","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahana","As-Saff","Al-Jumuah","Al-Munafiqún","At-Taghabún","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Háqqa","Al-Ma’árij","Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyámah","Ad-Dahr","Al-Mursalat","An-Naba’","An-Nazi'at","'Abasa","At-Takwir","Al-Infitár","Al-Mutaffifin","Al-Inshiqáq","Al-Burúj","At-Táriq","Al-Alá","Al-Gháshiya","Al-Fajr","Al-Balad","Ash-Shams","Al-Layl","Ad-Duhá","Ash-Sharh or Al- Inshiráh","At-Tin","Al-'Alaq","Al-Qadr","Al-Baiyina","Az-Zalzalah","Al-'Adiyát","Al-Qári'ah","At-Takáthur","Al-'Asr","Al-Humazah","Al-Fil","Quraish","Al-Má'ún","Al-Kawthar","Al-Káfirún","An-Nasr","Al-Masad","Al-Ikhlás","Al-Falaq","An-Nás"];

	$.fn.Quran = function(){
    var $quran = this;
    
    $quran.html(`
      <h2 style="display: inline;">Sura: <select class="sura-select"></select></h2>
      <div class="quranPageHeader clearfix">
        <button class="sura-left">◄ Previous Sura</button>
        <span class="page-controls">
          <button class="page-button page-left" original-title="">◄</button>
          Page <span class="page-number">1 of 1</span>
          <button class="page-button page-right" original-title="">►</button>
        </span>
        <button class="sura-right">Next Sura ►</button>
      </div>
      <div id="middleFrame">
        <div class="langs clearfix">
          <select class="lang-left"></select>
          <select class="lang-right"></select>
        </div>
        <table id="quranText"></table>
      </div>
      <div class="quranPageFooter">
        <button class="sura-left">◄ Previous Sura</button>
        <span class="page-controls">
          <button class="page-button page-left" original-title="">◄</button>
          Page <span class="page-number">1 of 1</span>
          <button class="page-button page-right" original-title="">►</button>
        </span>
        <button class="sura-right">Next Sura ►</button>
      </div>
    `);

		const $quranText = $('#quranText', $quran);//, $transText = $('#transText');
		const	$sura_select = $('.sura-select', $quran);
		const	$page_number = $('.page-number', $quran);
		const	$page_controls = $('.page-controls', $quran);

		const $page_left = $page_controls.find('.page-left');
		const $page_right = $page_controls.find('.page-right');

		const $sura_left = $('.sura-left', $quran);
		const $sura_right = $('.sura-right', $quran);

		const $lang_left = $('.lang-left', $quran);
		const $lang_right = $('.lang-right', $quran);

		const last_chapter = 113;
		let chapter = 0;//notice: 0 based, but display is 1 based.
		let	verse = undefined; //Used when url hash has verse value
		let page = 0, per_page = 10, pages = Math.ceil(verseCounts[chapter] / per_page);

		let lang_left = 'ar_uthmani', lang_right = 'en_ahamed';
			
		// function display(data, language){
		// 	var id = data.chapter+'.'+data.verse+'.';
		// 	return '<tr>'
		// 		+'<td class="ar">'+data.left+'</td>'
		// 		+'<td class="'+language+'"><a href="#'+id+'" class="ayaNumber" id="'+id+'">﴾'+id+'﴿</a> '+data.right+'</td>'
		// 		+'</tr>';
		// }

		function aya_link_template(chapter, verse){
			var id = (chapter+1)+'.'+(verse+1)+'.';
			return '<a href="#'+id+'" class="ayaNumber" id="'+id+'">﴾'+id+'﴿</a> ';
		}

		// function changeChapter(ch){
		// 	if (ch != chapter){
		// 		chapter = ch;
		// 		page = 0;
		// 		pages = Math.ceil(verseCounts[chapter] / per_page);
		// 		update();
		// 	}
		// }

		function initChapter(ch){
			if (ch >= 0) chapter = ch;
			verse = undefined;
			page = 0;
			pages = Math.ceil(verseCounts[chapter] / per_page);
			update();
		}

		function update(){
			// io.socket.get('/quran/'+chapter+'/0/en', function(data){
			// 	$pageNumber.html('Chapter ' + chapter);
			// 	$quranText.html('');
			// 	for (var i in data){
			// 		$quranText.append(display(data[i], 'en'));
			// 	}
			// });
			var hash = (chapter+1)+".";
			if (verse){
				hash += (verse+1)+'.';
			}else{
				hash += "p"+(page+1);
			}
			window.location.hash = hash;
			if (pages > 1){
				$page_number.html((page+1) + ' of ' + pages);
				if (page > 0){
					$page_left.removeAttr('disabled');
				}else{
					$page_left.attr('disabled', 'disabled');
				}
				if (page < pages-1){
					$page_right.removeAttr('disabled');
				}else{
					$page_right.attr('disabled', 'disabled');
				}
				$page_controls.show();
			}else{
				$page_controls.hide();
			}

			if (chapter > 0){
				$sura_left.show();//.removeAttr('disabled');
			}else{
				$sura_left.hide();//.attr('disabled', 'disabled');
			}
			if (chapter < last_chapter){
				$sura_right.show();//.removeAttr('disabled');
			}else{
				$sura_right.hide();//.attr('disabled', 'disabled');
			}
			
			$quranText.html('');
			var verses = verseCounts[chapter], start = 0, end = verses;
			if (verses > per_page){
				start = page*per_page;
				end = start+per_page;
				if (end > verses) end = verses;
			}
			for (var verse_index = start; verse_index < end; verse_index++){
				var $line = $('<tr>');

				if (lang_left != "none"){
					var left_obj = window.languages[lang_left];
					$('<td>')
						.addClass(left_obj.style)
						.html(left_obj.sura[chapter].verses[verse_index])
						.appendTo($line);//.append(aya_link_template(chapter, verse_index))
				}

				var right_obj = window.languages[lang_right];
				$('<td>')
					.addClass(right_obj.style)
					.append(aya_link_template(chapter, verse_index))
					.append(right_obj.sura[chapter].verses[verse_index])
					.appendTo($line);

				$quranText.append($line);

				// var data = {
				// 	chapter: chapter + 1,
				// 	verse: verse_index + 1,
				// 	right: en_ahamed[chapter].verses[verse_index],
				// 	left: ar_uthmani[chapter].verses[verse_index],
				// };
				// $quranText.append(display(data, 'en'));
			}
		}

		window.changeLanguage = function(lang, side){
			if (side){
				if (side == 'left'){
					lang_left = lang;
				}else{
					lang_right = lang;
				}
			}

			if (!side || lang_left == lang_right){
				lang_left = "none";
				lang_right = lang;
				$lang_left.val(lang_left);
			}
			update();
		}
		$lang_left.change(function(){
			var lang = $(this).val();
			changeLanguage(lang, 'left');
		});
		$lang_right.change(function(){
			var lang = $(this).val();
			changeLanguage(lang, 'right');
		});

		window.changeChapter = function(direction){
			if (direction == "left"){
				chapter--;
				if (chapter < 0) chapter = 0;
			}else{
				chapter++;
				if (chapter > last_chapter) chapter = last_chapter;
			}
			// page = 0;
			// pages = Math.ceil(verseCounts[chapter] / per_page);
			$sura_select.val(chapter);
			initChapter();
			// update();
		}
		$sura_left.click(function(){
			changeChapter('left');
		});
		$sura_right.click(function(){
			changeChapter('right');
		});

		window.changePage = function(direction){
			verse = undefined;//Clear out any specific verse selection.
			if (direction == "left"){
				page--;
				if (page < 0) page = 0;
			}else{
				page++;
				if (page >= pages) page = pages-1;
			}
			update();
		}
		$page_left.click(function(){
			changePage('left');
		});
		$page_right.click(function(){
			changePage('right');
		});
		

		$sura_select.change(function(e){
			var ch = parseInt($(this).val());
			// chapter = ch;
			// page = 0;
			// pages = Math.ceil(verseCounts[chapter] / per_page);
			// update();
			initChapter(ch);
		});

		//Initialize Select Boxes:
		for (var s in Suras){
			var sura_number = parseInt(s)+1;
			$sura_select.append('<option value="' + s + '">' + sura_number + '. ' + Suras[s] + '</option>');
		}

		$lang_left.append('<option value="none"></option>');
		for (var lang_id in window.languages){
			var lang_obj = window.languages[lang_id];
			var option = '<option value="' + lang_id + '">' + lang_obj.name + '</option>';
			$lang_left.append(option);
			$lang_right.append(option);
		}
		$lang_left.val(lang_left);
		$lang_right.val(lang_right);
		
		//Initialize page based on url hash:
		function parseURLHash(){
			if (window.location.hash){
				var url_vars = window.location.hash.match(/(\d+)\.((\d+)\.)?(p(\d+))?/),
					c = url_vars[1], //chapter value
					v = url_vars[3], //verse value
					p = url_vars[5]; //page number

				if (c){//chapter value found
					initChapter(parseInt(c)-1);
					$sura_select.val(chapter);
				}
				if (v) {//verse value found
					verse = parseInt(v)-1;
					page = Math.floor(verse/per_page);
				}else if (p) {//page value found
					page = parseInt(p)-1;
				}
			}
		}

		parseURLHash();
		update(); //Display the page

		//Scroll to the location of the selected verse:
		if (verse){
			var verse_loc = document.getElementById((chapter+1)+'.'+(verse+1)+'.');
			if (verse_loc.scrollIntoView) verse_loc.scrollIntoView();
		}
	}
};

window.addEventListener('DOMContentLoaded', function(){
  initialize(window.jQuery);
  $('#quran').Quran();
});