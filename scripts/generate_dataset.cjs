const fs = require('fs');
const path = require('path');
const dict = require('dictionary-of-colour-combinations');

// Load colors_raw with Japanese metadata
const colorsMetadata = [
  {"nameJa": "鴇色", "reading": "ときいろ", "romaji": "Toki-iro", "nameEn": "Hermosa Pink", "category": "red", "meaning": "Delicate rosy plumage under the wings of the crested ibis (toki); gentle and poetic."},
  {"nameJa": "肉色", "reading": "にくいろ", "romaji": "Niku-iro", "nameEn": "Corinthian Pink", "category": "red", "meaning": "Warm tender petal pink with peach warmth; symbolizes vitality and flesh."},
  {"nameJa": "一斤染", "reading": "いっこんぞめ", "romaji": "Ikkonzome", "nameEn": "Cameo Pink", "category": "red", "meaning": "Dyed with exactly one kin (600g) of safflower petals per silk roll; Heian court staple."},
  {"nameJa": "桜鼠", "reading": "さくらねずみ", "romaji": "Sakura-nezumi", "nameEn": "Fawn", "category": "red", "meaning": "Cherry blossom gray-pink; an Edo-period understated luxury neutral."},
  {"nameJa": "梅鼠", "reading": "うめねず", "romaji": "Ume-nezu", "nameEn": "Light Brown Drab", "category": "red", "meaning": "Plum blossom gray; smoky mauve-gray favored for understated chic (iki)."},
  {"nameJa": "珊瑚珠色", "reading": "さんごしゅいろ", "romaji": "Sangoshu-iro", "nameEn": "Coral Red", "category": "red", "meaning": "Polished Mediterranean coral red, prized in traditional hairpins and kimono belts."},
  {"nameJa": "柿色", "reading": "かきいろ", "romaji": "Kaki-iro", "nameEn": "Fresh Color", "category": "red", "meaning": "Ripe persimmon orange-red, rich with harvest warmth."},
  {"nameJa": "洗朱", "reading": "あらいしゅ", "romaji": "Araishu", "nameEn": "Grenadine Pink", "category": "red", "meaning": "Washed vermilion; a sun-warmed coral scarlet with nostalgic warmth."},
  {"nameJa": "浅紅", "reading": "うすくれない", "romaji": "Usukurenai", "nameEn": "Eosine Pink", "category": "red", "meaning": "Pale safflower magenta-crimson celebrated in classic Japanese waka poetry."},
  {"nameJa": "紅梅色", "reading": "こうばいいろ", "romaji": "Kōbai-iro", "nameEn": "Spinel Red", "category": "red", "meaning": "Vivid crimson-pink blossoms of early winter red plum trees blooming in snow."},
  {"nameJa": "長春色", "reading": "ちょうしゅんいろ", "romaji": "Chōshun-iro", "nameEn": "Old Rose", "category": "red", "meaning": "Rosa chinensis rose tone; romantic dusty rose beloved in Taisho modernism."},
  {"nameJa": "緋褪色", "reading": "ひざめいろ", "romaji": "Hizame-iro", "nameEn": "Eugenia Red", "category": "red", "meaning": "Sun-faded festival scarlet with vintage warmth and weathered textile patina."},
  {"nameJa": "浅緋", "reading": "うすひ", "romaji": "Usuhi", "nameEn": "Eugenia Red", "category": "red", "meaning": "Light scarlet; noble classical court dress color from the Taiho Code."},
  {"nameJa": "檜皮色", "reading": "ひわだいろ", "romaji": "Hiwada-iro", "nameEn": "Raw Sienna", "category": "red", "meaning": "Reddish-brown of layered cypress bark used for shrine roofs like Itsukushima."},
  {"nameJa": "柿渋色", "reading": "かきしぶいろ", "romaji": "Kakishibu-iro", "nameEn": "Vinaceous Tawny", "category": "red", "meaning": "Fermented astringent persimmon tannin dye used on paper umbrellas and woodwork."},
  {"nameJa": "紅柿色", "reading": "べにかきいろ", "romaji": "Benikaki-iro", "nameEn": "Jasper Red", "category": "red", "meaning": "Reddish persimmon tone combining safflower crimson with persimmon fruit warmth."},
  {"nameJa": "赤色", "reading": "あかいろ", "romaji": "Aka-iro", "nameEn": "Spectrum Red", "category": "red", "meaning": "Pure optical spectrum red, radiant and primal, symbolizing sunrise and life force."},
  {"nameJa": "朱色", "reading": "しゅいろ", "romaji": "Shu-iro", "nameEn": "Red Orange", "category": "red", "meaning": "Cinnabar vermilion seen on torii gates of Fushimi Inari and classic lacquerware."},
  {"nameJa": "雀茶", "reading": "すずめちゃ", "romaji": "Suzumecha", "nameEn": "Etruscan Red", "category": "red", "meaning": "Sparrow brown: the warm reddish-tan feathered nape of the Japanese sparrow."},
  {"nameJa": "栗梅", "reading": "くりうめ", "romaji": "Kuriume", "nameEn": "Burnt Sienna", "category": "red", "meaning": "Chestnut plum: earthy, refined reddish-brown favored by Kyoto merchants."},
  {"nameJa": "小豆茶", "reading": "あずきちゃ", "romaji": "Azukicha", "nameEn": "Ocher Red", "category": "red", "meaning": "Simmered red adzuki bean brown, evoking warm tea sweets and wagashi confections."},
  {"nameJa": "紅", "reading": "くれない", "romaji": "Kurenai", "nameEn": "Scarlet", "category": "red", "meaning": "Classic safflower scarlet, historically valued like precious gold in ancient Kyoto."},
  {"nameJa": "臙脂色", "reading": "えんじいろ", "romaji": "Enji-iro", "nameEn": "Carmine", "category": "red", "meaning": "Deep cochineal carmine; rich crimson with dark velvety depth."},
  {"nameJa": "浅蘇芳", "reading": "うすすおう", "romaji": "Ususuō", "nameEn": "Indian Lake", "category": "red", "meaning": "Light sappanwood lake: a delicate berry-wine red extracted from sappanwood."},
  {"nameJa": "牡丹色", "reading": "ぼたんいろ", "romaji": "Botan-iro", "nameEn": "Rosolane Purple", "category": "red", "meaning": "Peony flower magenta, symbolizing royalty, spring abundance, and beauty."},
  {"nameJa": "苺色", "reading": "いちごいろ", "romaji": "Ichigo-iro", "nameEn": "Pomegranate Purple", "category": "red", "meaning": "Wild mountain strawberry ruby red with rich jewel-tone warmth."},
  {"nameJa": "小豆色", "reading": "あずきいろ", "romaji": "Azuki-iro", "nameEn": "Hydrangea Red", "category": "red", "meaning": "Ripe adzuki bean reddish-purple, a staple color in traditional kimono layering."},
  {"nameJa": "柿色", "reading": "かきいろ", "romaji": "Kaki-iro", "nameEn": "Brick Red", "category": "red", "meaning": "Earthy terra-cotta brick red reminiscent of ceramic roof tiles and dried persimmons."},
  {"nameJa": "紅色", "reading": "べにいろ", "romaji": "Beni-iro", "nameEn": "Carmine Red", "category": "red", "meaning": "Noble crimson extracted from safflower petals, radiant yet composed."},
  {"nameJa": "紅樺色", "reading": "べにかばいろ", "romaji": "Benikaba-iro", "nameEn": "Pompeian Red", "category": "red", "meaning": "Birch bark red-brown; a strong earthy crimson beloved in Showa graphic prints."},
  {"nameJa": "茜色", "reading": "あかねいろ", "romaji": "Akane-iro", "nameEn": "Red", "category": "red", "meaning": "Madder root red, the sunset red immortalized in ancient Man'yōshū poetry."},
  {"nameJa": "鳶茶色", "reading": "とびちゃいろ", "romaji": "Tobicha-iro", "nameEn": "Brown", "category": "red", "meaning": "Black kite hawk feather tea brown; an earthy warm tobacco brown."},
  {"nameJa": "鳶色", "reading": "とびいろ", "romaji": "Tobi-iro", "nameEn": "Hay's Russet", "category": "red", "meaning": "Chestnut-russet tone of a flying hawk, widely worn by Edo period chonin."},
  {"nameJa": "紅海老茶", "reading": "べにえびちゃ", "romaji": "Beniebicha", "nameEn": "Vandyke Red", "category": "red", "meaning": "Crimson shrimp tea: a dark deep wine red used for women's hakama skirts in Meiji."},
  {"nameJa": "蘇芳色", "reading": "すおういろ", "romaji": "Suō-iro", "nameEn": "Pansy Purple", "category": "red", "meaning": "Extracted from sappanwood imported across ancient maritime Silk Road trade routes."},
  {"nameJa": "海老茶色", "reading": "えびちゃいろ", "romaji": "Ebicha-iro", "nameEn": "Pale Burnt Lake", "category": "red", "meaning": "Deep maroon-grape brown, synonymous with early modern female intellectuals."},
  {"nameJa": "京紫", "reading": "きょうむらさき", "romaji": "Kyō-murasaki", "nameEn": "Violet Red", "category": "red", "meaning": "Kyoto imperial purple dyed with gromwell root; aristocratic and reddish."},
  {"nameJa": "栗皮色", "reading": "くりかわいろ", "romaji": "Kurikawa-iro", "nameEn": "Vistoris Lake", "category": "red", "meaning": "The glossy brown skin of freshly cracked roasted sweet chestnuts."},
// 
  {"nameJa": "蒸栗色", "reading": "むしくりいろ", "romaji": "Mushikuri-iro", "nameEn": "Sulphur Yellow", "category": "yellow", "meaning": "Steamed peeled chestnut cream; warm pale buttery neutral that gives UI breathing room."},
  {"nameJa": "淡卵色", "reading": "うすたまごいろ", "romaji": "Usutamago-iro", "nameEn": "Pale Lemon Yellow", "category": "yellow", "meaning": "Light egg yolk cream, soft and luminously ambient like morning sunshine on shoji screens."},
  {"nameJa": "淡黄檗", "reading": "うすきはだ", "romaji": "Usukihada", "nameEn": "Naples Yellow", "category": "yellow", "meaning": "Light amur cork tree bark yellow; traditionally used for sacred Buddhist paper scrolls."},
  {"nameJa": "白茶", "reading": "しらちゃ", "romaji": "Shiracha", "nameEn": "Ivory Buff", "category": "yellow", "meaning": "White tea linen beige; an indispensable quiet backdrop in Japanese interior architecture."},
  {"nameJa": "肌色", "reading": "はだいろ", "romaji": "Hada-iro", "nameEn": "Seashell Pink", "category": "yellow", "meaning": "Natural alabaster skin tone, luminous and gently warm."},
  {"nameJa": "淡香色", "reading": "うすこういろ", "romaji": "Usukō-iro", "nameEn": "Light Pinkish Cinnamon", "category": "yellow", "meaning": "Faint incense dye hue: infused with clove and sandalwood fragrance."},
  {"nameJa": "砥粉色", "reading": "とのこいろ", "romaji": "Tonoko-iro", "nameEn": "Pinkish Cinnamon", "category": "yellow", "meaning": "Clay powder buff used by Japanese wood polishers to finish cedar and lacquer work."},
  {"nameJa": "玉蜀黍色", "reading": "とうもろこしいろ", "romaji": "Tōmorokoshi-iro", "nameEn": "Cinnamon Buff", "category": "yellow", "meaning": "Ripe sweetcorn silk yellow; warm, cheerful and gently appetizing."},
  {"nameJa": "卵色", "reading": "たまごいろ", "romaji": "Tamago-iro", "nameEn": "Cream Yellow", "category": "yellow", "meaning": "Rich domestic free-range egg yolk yellow, vibrant and appetizing."},
  {"nameJa": "金茶", "reading": "きんちゃ", "romaji": "Kincha", "nameEn": "Golden Yellow", "category": "yellow", "meaning": "Golden amber tea: combines the splendor of gold leaf with earthy tea warmth."},
  {"nameJa": "香色", "reading": "こういろ", "romaji": "Kō-iro", "nameEn": "Vinaceous Cinnamon", "category": "yellow", "meaning": "Clove and cinnamon incense dye, aristocratic and fragrant."},
  {"nameJa": "欵冬色", "reading": "ふきいろ", "romaji": "Fuki-iro", "nameEn": "Ochraceous Salmon", "category": "yellow", "meaning": "Petasites coltsfoot shoot salmon-tan; signifies early mountain spring forage."},
  {"nameJa": "落葉色", "reading": "おちばいろ", "romaji": "Ochiba-iro", "nameEn": "Isabella Color", "category": "yellow", "meaning": "Fallen autumn foliage: a mellow dry-leaf golden-brown."},
  {"nameJa": "幹色", "reading": "みきいろ", "romaji": "Miki-iro", "nameEn": "Maple", "category": "yellow", "meaning": "Tree trunk gray-tan: the bark of ancient zelkova and cryptomeria trees."},
  {"nameJa": "桑色白茶", "reading": "くわいろしらちゃ", "romaji": "Kuwairo-shiracha", "nameEn": "Olive Buff", "category": "yellow", "meaning": "Mulberry tea buff: the delicate celadon-tan of dried mulberry wood."},
  {"nameJa": "灰汁色", "reading": "あくいろ", "romaji": "Aku-iro", "nameEn": "Ecru", "category": "yellow", "meaning": "Lye water ash-gray: a subtle taupe neutral created in traditional textile scours."},
  {"nameJa": "黄色", "reading": "きいろ", "romaji": "Ki-iro", "nameEn": "Yellow", "category": "yellow", "meaning": "Pure sunlit yellow, clear and vibrant like freshly dyed gardenia fruit."},
  {"nameJa": "金絲雀色", "reading": "かなりやいろ", "romaji": "Kanariya-iro", "nameEn": "Lemon Yellow", "category": "yellow", "meaning": "Canary bird plumage yellow: cheerful, brilliant and energetic."},
  {"nameJa": "鬱金色", "reading": "うこんいろ", "romaji": "Ukon-iro", "nameEn": "Apricot Yellow", "category": "yellow", "meaning": "Turmeric root yellow; traditionally believed to repel insects from silk robes and book wraps."},
  {"nameJa": "淡青朽葉", "reading": "うすあおくちば", "romaji": "Usuaokuchiba", "nameEn": "Pyrite Yellow", "category": "yellow", "meaning": "Pale greenish-yellow autumn leaf, capturing the quiet shift between summer and fall."},
  {"nameJa": "油色", "reading": "あぶらいろ", "romaji": "Abura-iro", "nameEn": "Olive Ocher", "category": "yellow", "meaning": "Cold-pressed sesame oil color; deep lustrous golden amber."},
  {"nameJa": "山吹茶", "reading": "やまぶきちゃ", "romaji": "Yamabukicha", "nameEn": "Yellow Ocher", "category": "yellow", "meaning": "Golden mountain rose tea: a grounded mustard ocher with rich historical gravity."},
  {"nameJa": "山吹色", "reading": "やまぶきいろ", "romaji": "Yamabuki-iro", "nameEn": "Orange Yellow", "category": "yellow", "meaning": "Japanese kerria rose blossom golden-orange; famous slang for gold koban coins."},
  {"nameJa": "柑子色", "reading": "こうじいろ", "romaji": "Kōji-iro", "nameEn": "Yellow Orange", "category": "yellow", "meaning": "Sweet mikan mandarin orange peel; joyful and inviting."},
  {"nameJa": "深支子", "reading": "こきくちなし", "romaji": "Kokikuchinashi", "nameEn": "Apricot Orange", "category": "yellow", "meaning": "Deep gardenia fruit orange; a forbidden color in Heian court reserved for princes."},
  {"nameJa": "橙色", "reading": "とうしょく", "romaji": "Tōshoku", "nameEn": "Orange", "category": "yellow", "meaning": "Bitter Seville orange (daidai), symbol of longevity placed on New Year kagami mochi."},
  {"nameJa": "杏色", "reading": "あんずいろ", "romaji": "Anzu-iro", "nameEn": "Peach Red", "category": "yellow", "meaning": "Sun-ripened summer apricot flesh, vibrant and juicy."},
  {"nameJa": "蒲色", "reading": "かばいろ", "romaji": "Kaba-iro", "nameEn": "English Red", "category": "yellow", "meaning": "Named after flowering bulrush cattail spikes; warm brick-terracotta red."},
  {"nameJa": "代赭色", "reading": "たいしゃいろ", "romaji": "Taisha-iro", "nameEn": "Cinnamon Rufous", "category": "yellow", "meaning": "Natural iron oxide red ochre mined in Taishan, used since ancient temple wall murals."},
  {"nameJa": "飴色", "reading": "あめいろ", "romaji": "Ame-iro", "nameEn": "Orange Rufous", "category": "yellow", "meaning": "Malted barley hard candy amber; transparent warmth found on vintage bento lacquerware."},
  {"nameJa": "黄檗色", "reading": "きはだいろ", "romaji": "Kihada-iro", "nameEn": "Sulphine Yellow", "category": "yellow", "meaning": "Medicinal phellodendron amurense bark dye, crisp acidic greenish-yellow."},
  {"nameJa": "黄茶", "reading": "きちゃ", "romaji": "Kicha", "nameEn": "Khaki", "category": "yellow", "meaning": "Mustard-khaki tea brown, versatile utilitarian color with earthy depth."},
  {"nameJa": "菜種油色", "reading": "なたねいろ", "romaji": "Natane-iro", "nameEn": "Citron Yellow", "category": "yellow", "meaning": "Rapeseed blossom oil color; fresh chartreuse green-gold."},
  {"nameJa": "青朽葉", "reading": "あおくちば", "romaji": "Aokuchiba", "nameEn": "Citrine", "category": "yellow", "meaning": "Greenish decaying autumn leaf, celebrated in Heian layering combinations."},
  {"nameJa": "黄海松茶", "reading": "きみるちゃ", "romaji": "Kimirucha", "nameEn": "Buffy Citrine", "category": "yellow", "meaning": "Golden seaweed tea green; refined tea ceremony master palette."},
  {"nameJa": "路考茶", "reading": "ろこうちゃ", "romaji": "Rokōcha", "nameEn": "Dark Citrine", "category": "yellow", "meaning": "Made famous by Edo Kabuki onnagata Segawa Kikunojo (stage name Rokō)."},
  {"nameJa": "利久茶", "reading": "りきゅうちちゃ", "romaji": "Rikyūcha", "nameEn": "Light Grayish Olive", "category": "yellow", "meaning": "Named in homage to Sen no Rikyū, grandfather of wabi-cha tea aesthetic."},
  {"nameJa": "鶯色", "reading": "うぐいすいろ", "romaji": "Uguisu-iro", "nameEn": "Kronbergs Green", "category": "yellow", "meaning": "Japanese bush warbler olive-green, heralding spring with its first call."},
  {"nameJa": "橄欖色", "reading": "オリーブ", "romaji": "Kanran-iro", "nameEn": "Olive", "category": "yellow", "meaning": "Olive green fruit, adopted in early 20th-century Western art movements in Japan."},
  {"nameJa": "銀煤竹", "reading": "ぎんすすたけ", "romaji": "Ginsusutake", "nameEn": "Orange Citrine", "category": "yellow", "meaning": "Soot-stained bamboo from thatched farmhouse roofs aged over centuries."},
  {"nameJa": "丁字茶", "reading": "ちょうじちゃ", "romaji": "Chōjicha", "nameEn": "Sudan Brown", "category": "yellow", "meaning": "Clove tea brown dyed using dried aromatic clove buds."},
  {"nameJa": "海松茶", "reading": "みるちゃ", "romaji": "Mirucha", "nameEn": "Olive Green", "category": "yellow", "meaning": "Codium marine algae tea; rich earthy moss olive."},
  {"nameJa": "鶯茶", "reading": "うぐいすちゃ", "romaji": "Uguisucha", "nameEn": "Light Brownish Olive", "category": "yellow", "meaning": "Edo brownish bush warbler tone with understated warmth."},
  {"nameJa": "生壁色", "reading": "なまかべいろ", "romaji": "Namakabe-iro", "nameEn": "Deep Grayish Olive", "category": "yellow", "meaning": "Freshly plastered mud wall tone of traditional Japanese tearooms."},
  {"nameJa": "媚茶色", "reading": "こびちゃいろ", "romaji": "Kobicha-iro", "nameEn": "Pale Raw Umber", "category": "yellow", "meaning": "Alluring tea brown: a sophisticated kelp brown popular in Yoshiwara fashion."},
  {"nameJa": "憲法色", "reading": "けんぽういろ", "romaji": "Kempō-iro", "nameEn": "Sepia", "category": "yellow", "meaning": "Deep dark sepia-brown created by 16th-century master swordsman Yoshioka Kempō."},
  {"nameJa": "赤白橡", "reading": "あかのしろつるばみ", "romaji": "Akanoshirotsurubami", "nameEn": "Madder Brown", "category": "yellow", "meaning": "Acorn and madder dye; noble ancient brown worn in Nara court garments."},
  {"nameJa": "煙草色", "reading": "たばこいろ", "romaji": "Tabako-iro", "nameEn": "Mars Brown / Tobacco", "category": "yellow", "meaning": "Cured leaf tobacco brown, introduced via Portuguese trade in the Nanban period."},
  {"nameJa": "焦茶色", "reading": "こげちゃいろ", "romaji": "Kogecha-iro", "nameEn": "Vandyke Brown", "category": "yellow", "meaning": "Scorched tea dark espresso brown; universally timeless luxury neutral."},
// 
  {"nameJa": "白緑", "reading": "びゃくろく", "romaji": "Byakuroku", "nameEn": "Turquoise Green", "category": "green", "meaning": "Finely pulverized malachite pigment creating an ethereal pale mint celadon."},
  {"nameJa": "裏葉色", "reading": "うらはいろ", "romaji": "Uraha-iro", "nameEn": "Glaucous Green", "category": "green", "meaning": "The pale frosted underside of leaves turned up by summer mountain breezes."},
  {"nameJa": "若苗色", "reading": "わかなえいろ", "romaji": "Wakanae-iro", "nameEn": "Dark Greenish Glaucous", "category": "green", "meaning": "Fresh rice seedling shoots in spring paddy fields."},
  {"nameJa": "若草色", "reading": "わかくさいろ", "romaji": "Wakakusa-iro", "nameEn": "Yellow Green", "category": "green", "meaning": "Freshly sprouted spring meadow grass under crisp early sunshine."},
  {"nameJa": "鶸色", "reading": "ひわいろ", "romaji": "Hiwa-iro", "nameEn": "Light Green Yellow", "category": "green", "meaning": "Eurasian siskin bird yellow-green feathers, lively and vibrant."},
  {"nameJa": "鶸萌木", "reading": "ひわもえぎ", "romaji": "Hiwamoegi", "nameEn": "Night Green", "category": "green", "meaning": "A sharp, vivacious chartreuse green combining siskin and young tree shoots."},
  {"nameJa": "苔色", "reading": "こけいろ", "romaji": "Koke-iro", "nameEn": "Olive Yellow", "category": "green", "meaning": "Ancient temple rock moss green seen in Kyoto zen gardens like Saihō-ji."},
  {"nameJa": "千草鼠", "reading": "ちぐさねずみ", "romaji": "Chigusanezu", "nameEn": "Artemisia Green", "category": "green", "meaning": "Muted sage herb gray-green, calm and balanced."},
  {"nameJa": "山鳩色", "reading": "やまばといろ", "romaji": "Yamabato-iro", "nameEn": "Andover Green", "category": "green", "meaning": "Oriental turtle dove feathered gray-green."},
  {"nameJa": "松葉色", "reading": "まつばいろ", "romaji": "Matsuba-iro", "nameEn": "Rainette Green", "category": "green", "meaning": "Evergreen pine needles, symbol of longevity and steadfast endurance."},
  {"nameJa": "老緑", "reading": "おいみどり", "romaji": "Oimidori", "nameEn": "Chromium Green", "category": "green", "meaning": "Deep seasoned forest pine green with aged, dignified maturity."},
  {"nameJa": "木賊色", "reading": "とくさいろ", "romaji": "Tokusa-iro", "nameEn": "Pistachio Green", "category": "green", "meaning": "Scouring rush horsetail stem green, used by craftspeople to polish fine wood."},
  {"nameJa": "若竹色", "reading": "わかたけいろ", "romaji": "Wakatake-iro", "nameEn": "Sea Green", "category": "green", "meaning": "Young summer bamboo shoot green, fresh and optimistic."},
  {"nameJa": "青竹色", "reading": "あおたけいろ", "romaji": "Aotake-iro", "nameEn": "Benzol Green", "category": "green", "meaning": "Mature green bamboo forest hue, sharp and refreshing."},
  {"nameJa": "老竹色", "reading": "おいたけいろ", "romaji": "Oitake-iro", "nameEn": "Light Porcelain Green", "category": "green", "meaning": "Aged deep emerald-teal bamboo with ancient tranquility."},
  {"nameJa": "緑色", "reading": "みどりいろ", "romaji": "Midori-iro", "nameEn": "Green", "category": "green", "meaning": "Classic balanced green, soothing and vital."},
  {"nameJa": "草色", "reading": "くさいろ", "romaji": "Kusa-iro", "nameEn": "Dull Viridian Green", "category": "green", "meaning": "Fresh meadow herbs and leaves; crisp rich verdant viridian."},
  {"nameJa": "麹塵", "reading": "きくじん", "romaji": "Kikujin", "nameEn": "Oil Green", "category": "green", "meaning": "Brewers' kōji mold green; legendary sacred robe color worn by Japanese Emperors."},
  {"nameJa": "常磐色", "reading": "ときわいろ", "romaji": "Tokiwa-iro", "nameEn": "Diamine Green", "category": "green", "meaning": "Eternal evergreen pine color symbolizing timeless rock and steadfast constancy."},
  {"nameJa": "萌木色", "reading": "もえぎいろ", "romaji": "Moegi-iro", "nameEn": "Cossack Green", "category": "green", "meaning": "Spring sprout green; one of the favorite colors of young samurai warriors in Heian epics."},
  {"nameJa": "海松色", "reading": "みるいろ", "romaji": "Miru-iro", "nameEn": "Lincoln Green", "category": "green", "meaning": "Deep forest lichen and coastal kelp green; deep, subtle, and contemplative."},
  {"nameJa": "藍海松茶", "reading": "あいみるちゃ", "romaji": "Aimirucha", "nameEn": "Blackish Olive", "category": "green", "meaning": "Indigo and seaweed tea; a sophisticated dark olive-teal."},
  {"nameJa": "千斎茶", "reading": "せんさいちゃ", "romaji": "Sensaicha", "nameEn": "Deep Slate Olive", "category": "green", "meaning": "Deep black-olive slate brown named after the Sen clan tea masters."},
// 
  {"nameJa": "水色", "reading": "みずいろ", "romaji": "Mizu-iro", "nameEn": "Nile Blue", "category": "blue", "meaning": "Pure crystal mountain water blue, clean and weightless."},
  {"nameJa": "瓶覗", "reading": "かめのぞき", "romaji": "Kamenozoki", "nameEn": "Pale King's Blue", "category": "blue", "meaning": "'A glance into the indigo vat': the very faintest dip of white silk into fresh indigo dye."},
  {"nameJa": "深川鼠", "reading": "ふかがわねずみ", "romaji": "Fukagawa-nezu", "nameEn": "Light Glaucous Blue", "category": "blue", "meaning": "Fukagawa district cool river mist gray-blue, fashionable among Edo woodblock printmakers."},
  {"nameJa": "空色", "reading": "そらいろ", "romaji": "Sora-iro", "nameEn": "Salvia Blue", "category": "blue", "meaning": "Clear daytime sky blue, serene and expansively airy."},
  {"nameJa": "青磁色", "reading": "せいじいろ", "romaji": "Seiji-iro", "nameEn": "Cobalt Green", "category": "blue", "meaning": "Song dynasty and Nabeshima celadon porcelain glaze blue-green."},
  {"nameJa": "淡浅葱", "reading": "うすあさぎ", "romaji": "Usuasagi", "nameEn": "Calamine Blue", "category": "blue", "meaning": "Pale scallion green-blue; cool aquatic turquoise tone."},
  {"nameJa": "水浅葱", "reading": "みずあさぎ", "romaji": "Mizuasagi", "nameEn": "Venice Green", "category": "blue", "meaning": "Watered scallion blue: an elegant jade-aqua wash."},
  {"nameJa": "花浅葱", "reading": "はなあさぎ", "romaji": "Hanaasagi", "nameEn": "Cerulian Blue", "category": "blue", "meaning": "Blooming dayflower blue (tsuyukusa) blended with light indigo; deep vivid cerulean."},
  {"nameJa": "浅葱色", "reading": "あさぎいろ", "romaji": "Asagi-iro", "nameEn": "Peacock Blue", "category": "blue", "meaning": "Famous green-blue of Shinsengumi samurai haori jackets in late Edo Kyoto."},
  {"nameJa": "納戸鼠", "reading": "なんどねずみ", "romaji": "Nandonezu", "nameEn": "Green Blue", "category": "blue", "meaning": "Dark closet teal-gray, modest and sophisticated for kimono linings."},
  {"nameJa": "浅縹", "reading": "うすはなだ", "romaji": "Usuhanada", "nameEn": "Olympic Blue", "category": "blue", "meaning": "Light indigo blue; a clear cornflower blue celebrated in ancient courts."},
  {"nameJa": "青色", "reading": "あおいろ", "romaji": "Ao-iro", "nameEn": "Blue", "category": "blue", "meaning": "Classic rich cobalt-sapphire blue, deeply vibrant."},
  {"nameJa": "納戸色", "reading": "なんどいろ", "romaji": "Nando-iro", "nameEn": "Antwerp Blue", "category": "blue", "meaning": "Storeroom blue: a deep petrol blue-green that was the most popular working color of Edo."},
  {"nameJa": "活色", "reading": "かついろ", "romaji": "Katsu-iro", "nameEn": "Helvetia Blue", "category": "blue", "meaning": "Also written '勝色' (victory color); pounded dark indigo worn by samurai as lucky armor undergarment."},
  {"nameJa": "藍鼠", "reading": "あいねずみ", "romaji": "Ainezumi", "nameEn": "Dark Medici Blue", "category": "blue", "meaning": "Indigo gray; subtle steely blue-gray with quiet modern elegance."},
  {"nameJa": "海松藍", "reading": "みるあい", "romaji": "Miruai", "nameEn": "Dusky Green", "category": "blue", "meaning": "Seaweed indigo: dark deep oceanic pine teal."},
  {"nameJa": "群青色", "reading": "ぐんじょういろ", "romaji": "Gunjō-iro", "nameEn": "Deep Lyons Blue", "category": "blue", "meaning": "Precious lapis lazuli ultramarine mineral pigment, seen in Ogata Korin's Irises screens."},
  {"nameJa": "花色", "reading": "はないろ", "romaji": "Hana-iro", "nameEn": "Violet Blue", "category": "blue", "meaning": "Dayflower indigo: a dusky twilight navy with a hint of purple."},
  {"nameJa": "縹色", "reading": "はなだいろ", "romaji": "Hanada-iro", "nameEn": "Vandar Poel's Blue", "category": "blue", "meaning": "Traditional pure mid-tone indigo blue of classical Japan."},
  {"nameJa": "深縹", "reading": "こきはなだ", "romaji": "Kokihanada", "nameEn": "Dark Tyrian Blue", "category": "blue", "meaning": "Deep dark indigo, dipped repeatedly to achieve an ink-like navy."},
  {"nameJa": "褐色", "reading": "かちいろ", "romaji": "Kachi-iro", "nameEn": "Dull Violet Black", "category": "blue", "meaning": "Pounded indigo black-navy, so dark it touches midnight violet."},
  {"nameJa": "紺色", "reading": "こんいろ", "romaji": "Kon-iro", "nameEn": "Deep Indigo", "category": "blue", "meaning": "Standard Japanese navy; pure, reliable, disciplined and profound."},
  {"nameJa": "鉄色", "reading": "てついろ", "romaji": "Tetsu-iro", "nameEn": "Deep Slate Green", "category": "blue", "meaning": "Iron kettle green-black; dark mineral slate favored for merchant shop curtains (noren)."},
// 
  {"nameJa": "藤色", "reading": "ふじいろ", "romaji": "Fuji-iro", "nameEn": "Grayish Lavender", "category": "purple", "meaning": "Cascading wisteria blossoms, the supreme aesthetic emblem of the Fujiwara clan."},
  {"nameJa": "薄色", "reading": "うすいろ", "romaji": "Usuiro", "nameEn": "Grayish Lavender", "category": "purple", "meaning": "Delicate mourning lavender favored by Heian courtiers for tender remembrance."},
  {"nameJa": "紅藤", "reading": "べにふじ", "romaji": "Benifuji", "nameEn": "Laelia Pink", "category": "purple", "meaning": "Reddish wisteria: a dreamy lilac-rose favored in spring kimono."},
  {"nameJa": "鳩羽紫", "reading": "はとばむらさき", "romaji": "Hatoba-murasaki", "nameEn": "Lilac", "category": "purple", "meaning": "The iridescent violet-gray sheen on the neck feathers of wild doves."},
  {"nameJa": "梅紫", "reading": "うめむらさき", "romaji": "Umemurasaki", "nameEn": "Eupatorium Purple", "category": "purple", "meaning": "Plum blossom violet: a deep vivid raspberry mauve."},
  {"nameJa": "浅紫", "reading": "うすむらさき", "romaji": "Usumurasaki", "nameEn": "Light Mauve", "category": "purple", "meaning": "Light purple dyed with rare gromwell root; graceful and airy."},
  {"nameJa": "半色", "reading": "はしたいろ", "romaji": "Hashita-iro", "nameEn": "Aconite Violet", "category": "purple", "meaning": "'In-between color': intermediate purple between deep forbidden purple and light dye."},
  {"nameJa": "藤納戸", "reading": "ふじなんど", "romaji": "Fujinando", "nameEn": "Dull Blue Violet", "category": "purple", "meaning": "Wisteria closet: a muted slate-periwinkle blue-violet."},
  {"nameJa": "二藍", "reading": "ふたあい", "romaji": "Futaai", "nameEn": "Dark Soft Violet", "category": "purple", "meaning": "'Twice indigo': dyed with red safflower first then over-dyed with blue indigo."},
  {"nameJa": "桔梗色", "reading": "ききょういろ", "romaji": "Kikyō-iro", "nameEn": "Blue Violet", "category": "purple", "meaning": "Bellflower purple-blue; one of the Seven Autumn Herbs of ancient poetry."},
  {"nameJa": "浅滅紫", "reading": "うすけしむらさき", "romaji": "Usukeshimurasaki", "nameEn": "Purple Drab", "category": "purple", "meaning": "Extinguished violet: an ash-smothered vintage wine purple."},
  {"nameJa": "藤鼠", "reading": "ふじねずみ", "romaji": "Fujinezu", "nameEn": "Deep Violet / Plumbeous", "category": "purple", "meaning": "Wisteria gray; quiet, cool steel-lavender."},
  {"nameJa": "牡丹鼠", "reading": "ぼたんねずみ", "romaji": "Botannezu", "nameEn": "Vernonia Purple", "category": "purple", "meaning": "Peony gray: dusky rose-violet with elegant somber dignity."},
  {"nameJa": "蒲葡萄色", "reading": "えびいろ", "romaji": "Ebiiro", "nameEn": "Dark Slate Purple", "category": "purple", "meaning": "Wild mountain grape purple with rich autumnal depth."},
  {"nameJa": "濃色", "reading": "こきいろ", "romaji": "Koki-iro", "nameEn": "Taupe Brown", "category": "purple", "meaning": "Historically the darkest legal purple in Japanese imperial court rank hierarchy."},
  {"nameJa": "桑染色", "reading": "くわぞめいろ", "romaji": "Kuwazome-iro", "nameEn": "Violet Carmine", "category": "purple", "meaning": "Mulberry dye carmine: rich deep claret wine tone."},
  {"nameJa": "紫色", "reading": "むらさきいろ", "romaji": "Murasaki-iro", "nameEn": "Violet", "category": "purple", "meaning": "Imperial violet: the pinnacle of Japanese chromatic prestige."},
  {"nameJa": "菖蒲色", "reading": "あやめいろ", "romaji": "Ayame-iro", "nameEn": "Red Violet", "category": "purple", "meaning": "Sweet iris blossom purple; bold, ceremonial and noble."},
  {"nameJa": "杜若色", "reading": "かきつばたいろ", "romaji": "Kakitsubata-iro", "nameEn": "Cotinga Purple", "category": "purple", "meaning": "Water iris purple made immortal in Tales of Ise at the Yatsuhashi bridge."},
  {"nameJa": "黒紫", "reading": "こくし", "romaji": "Kokushi", "nameEn": "Dusky Madder Violet", "category": "purple", "meaning": "Blackened violet: deepest night purple bordering on black."},
// 
  {"nameJa": "白色", "reading": "しろいろ", "romaji": "Shiro-iro", "nameEn": "White", "category": "neutral", "meaning": "Pure untouched white, symbolizing ritual purity and empty space (Ma)."},
  {"nameJa": "銀鼠", "reading": "ぎんねず", "romaji": "Ginnezu", "nameEn": "Neutral Gray", "category": "neutral", "meaning": "Silver-gray rat tone: a luminous pale gray embodying urban chic in the Edo period."},
  {"nameJa": "鼠色", "reading": "ねずみいろ", "romaji": "Nezumi-iro", "nameEn": "Mineral Gray", "category": "neutral", "meaning": "Classic mouse mineral gray; basis of the 'forty-eight browns and one hundred grays' culture."},
  {"nameJa": "灰色", "reading": "はいいろ", "romaji": "Hai-iro", "nameEn": "Warm Gray", "category": "neutral", "meaning": "Warm hearth ash-gray; organic stone tone that balances vivid pairings."},
  {"nameJa": "石板色", "reading": "せきばんいろ", "romaji": "Sekiban-iro", "nameEn": "Slate Color", "category": "neutral", "meaning": "Dark roofing slate stone; a strong grounding charcoal with subtle blue-green coolness."},
  {"nameJa": "黒色", "reading": "くろいろ", "romaji": "Kuro-iro", "nameEn": "Black", "category": "neutral", "meaning": "Pure pitch sumi ink black: the absolute anchor of contrast in Japanese aesthetics."}
];

// Combine with npm dict package
const processedColors = dict.map((item, index) => {
  const meta = colorsMetadata[index] || {};
  return {
    id: index + 1,
    nameJa: meta.nameJa || item.name,
    reading: meta.reading || '',
    romaji: meta.romaji || item.name,
    nameEn: item.name,
    cmyk: item.cmyk,
    rgb: item.rgb,
    hex: item.hex,
    lab: item.lab,
    category: meta.category || 'neutral',
    palettes: item.combinations,
    meaning: meta.meaning || `Traditional Japanese shade: ${item.name}`
  };
});

// Build 348 palettes
const featuredIds = new Set([
  1, 2, 4, 6, 14, 17, 21, 22, 27, 34, 37, 39, 42, 46, 51, 60, 62, 78, 86, 92, 99, 101, 107, 114, 117,
  122, 126, 128, 134, 139, 140, 141, 147, 151, 154, 161, 163, 166, 170, 179, 189, 194, 215, 230,
  241, 242, 247, 251, 257, 260, 266, 272, 281, 286, 297, 300, 308, 312, 333, 347, 348
]);

const designerTips = {
  1: "Iconic book cover pairing. Warm English Red against deep Cerulean Blue creates an arresting yet classic contrast for primary call-to-actions and hero visual anchors.",
  2: "Deep ink navy paired with energetic mikan orange. Perfect for dark-mode SaaS headers, giving maximum readability and punchy accent buttons.",
  6: "The quintessential Japanese modern contrast. Deep sumi-indigo background with warm Grenadine Pink highlights makes digital typography feel tactile and human.",
  22: "A legendary Bauhaus-adjacent optical chord. Deep Lyons ultramarine paired with pure sunflower yellow provides instant hierarchy for posters and hero cards.",
  27: "Quiet luxury editorial. Corinthian blush pink against charcoal slate provides an exquisite palette for lifestyle, beauty, and refined portfolio websites.",
  34: "Subtle Japanese wabi-sabi minimalism. Eosine pink softens the cool architectural neutral gray, ideal for micro-interactions and status tags.",
  60: "Midnight and morning light. Dark Tyrian blue with soft lemon cream yellow creates an ultra-legible high-contrast dark theme without pure white eye strain.",
  86: "Warm natural timber and living bamboo. Raw sienna and sea green evoke organic craftsmanship, ideal for sustainable, coffee, or architecture brands.",
  122: "A masterwork Showa triad: fresh bamboo green, custard cream, and deep carmine crimson. Creates lively graphic rhythm across cards, badges, and headers.",
  139: "The premier corporate / product design blue triad. Slate neutral, midnight indigo, and airy salvia blue build effortless digital interface states (default, hover, active).",
  151: "Vibrant and decisive. Mandarin orange meets ocean indigo and sulphur cream—instantly distinct for branding identity systems and mobile app splash screens.",
  154: "The primary color triad elevated by historical pigment depth: carmine, golden yellow, and cobalt blue. Playful yet deeply grounded.",
  241: "Sanzo Wada's most celebrated 4-color cruciform composition. Red-orange, dark medici blue, pale lemon, and isabella tan form a completely harmonious web design system.",
  242: "Avant-garde editorial quartet. Delicate pink, evergreen pine, burnt terra-cotta, and obsidian black create an editorial magazine cover aesthetic.",
  266: "Botanical sanctuary. Spectrum red accents against ivory buff canvas, anchored by deep pine and bamboo greens.",
  281: "Ocean and Celadon. Antwerp blue, benzol green, pale lemon, and cobalt green offer a calming, fresh aesthetic for fintech and wellness platforms."
};

const processedPalettes = [];

for (let id = 1; id <= 348; id++) {
  const code = String(id).padStart(3, '0');
  const paletteColors = processedColors.filter(c => c.palettes.includes(id));
  const count = paletteColors.length;
  const type = count === 2 ? 'two-color' : count === 3 ? 'three-color' : 'four-color';

  // Construct name
  const nameEn = paletteColors.map(c => c.nameEn).join(' & ');
  const nameJa = paletteColors.map(c => c.nameJa).join(' と ');

  // Compute harmony
  const categories = new Set(paletteColors.map(c => c.category));
  let harmonyType = 'contrast';
  if (categories.size === 1) harmonyType = 'modulation';
  else if (paletteColors.some(c => c.category === 'neutral')) harmonyType = 'pan-tone';

  // Tags
  const tags = [];
  if (count === 2) tags.push('2-Color Chord');
  if (count === 3) tags.push('3-Color Triad');
  if (count === 4) tags.push('4-Color Cruciform');

  if (featuredIds.has(id)) tags.push('Designer Favorite');
  if (paletteColors.some(c => c.category === 'blue') && paletteColors.some(c => c.category === 'red')) tags.push('High Contrast');
  if (paletteColors.some(c => c.category === 'neutral')) tags.push('Minimalist');
  if (paletteColors.some(c => c.nameEn.includes('Pink') || c.nameEn.includes('Lavender') || c.nameEn.includes('Pale'))) tags.push('Soft Pastel');
  if (paletteColors.some(c => c.nameEn.includes('Brown') || c.nameEn.includes('Sienna') || c.nameEn.includes('Olive'))) tags.push('Earthy Wabi-Sabi');
  if (paletteColors.some(c => c.nameEn.includes('Black') || c.nameEn.includes('Indigo') || c.nameEn.includes('Dark'))) tags.push('Luxury Dark');
  if (paletteColors.some(c => c.nameEn.includes('Red') || c.nameEn.includes('Orange') || c.nameEn.includes('Yellow'))) tags.push('Warm Accent');
  tags.push('Web UI');

  const tip = designerTips[id] || (
    count === 2
      ? `A calibrated 2-tone harmony (${paletteColors[0].nameEn} & ${paletteColors[1].nameEn}). Use the dominant shade for primary branding and the lighter shade for card surfaces or highlights.`
      : count === 3
      ? `A balanced 3-color chord. Recommended: ${paletteColors[0].nameEn} for structural elements, ${paletteColors[1].nameEn} for container backgrounds, and ${paletteColors[2].nameEn} for key actions.`
      : `A complex 4-color cruciform palette. Offers full spectrum roles for complex web applications: background, container, brand accent, and state highlight.`
  );

  processedPalettes.push({
    id,
    code,
    count,
    type,
    colors: paletteColors,
    name: nameEn,
    nameJa: nameJa,
    tags: Array.from(new Set(tags)),
    featured: featuredIds.has(id),
    designerTip: tip,
    harmonyType
  });
}

// Write src/data/colors.ts
const colorsTs = `import { WadaColor } from '../types';

export const WADA_COLORS: WadaColor[] = ${JSON.stringify(processedColors, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/colors.ts'), colorsTs, 'utf8');

// Write src/data/palettes.ts
const palettesTs = `import { WadaPalette } from '../types';

export const WADA_PALETTES: WadaPalette[] = ${JSON.stringify(processedPalettes, null, 2)};

export const FEATURED_PALETTES = WADA_PALETTES.filter(p => p.featured);
`;

fs.writeFileSync(path.join(__dirname, '../src/data/palettes.ts'), palettesTs, 'utf8');

console.log('Successfully generated:');
console.log('- src/data/colors.ts (' + processedColors.length + ' colors)');
console.log('- src/data/palettes.ts (' + processedPalettes.length + ' palettes)');
