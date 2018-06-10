package com.herokuapp.kon104.webapp.service;

import com.herokuapp.kon104.webapp.domain.GrgmapAppForm;
import java.util.Map;
import java.util.HashMap;
import org.springframework.stereotype.Service;


@Service
public class GrgmapAppFormService
{
	private Map<Integer, GrgmapAppForm> appforms = new HashMap<Integer, GrgmapAppForm>(){
		{
			put(1, new GrgmapAppForm(1, "北海道"));
			put(2, new GrgmapAppForm(2, "青森県"));
			put(3, new GrgmapAppForm(3, "岩手県"));
			put(4, new GrgmapAppForm(4, "宮城県"));
			put(5, new GrgmapAppForm(5, "秋田県"));
			put(6, new GrgmapAppForm(6, "山形県"));
			put(7, new GrgmapAppForm(7, "福島県"));
			put(8, new GrgmapAppForm(8, "茨城県"));
			put(9, new GrgmapAppForm(9, "栃木県"));
			put(10, new GrgmapAppForm(10, "群馬県"));
			put(11, new GrgmapAppForm(11, "埼玉県"));
			put(12, new GrgmapAppForm(12, "千葉県"));
			put(13, new GrgmapAppForm(13, "東京都"));
			put(14, new GrgmapAppForm(14, "神奈川県"));
		}
	};


	public GrgmapAppFormService()
	{
		// 北海道
		this.appforms.get(1).distUrl = "http://www.police.pref.hokkaido.lg.jp/guide/jidousya/jidousya.html";
		this.appforms.get(1).pdfUrl = "http://www.police.pref.hokkaido.lg.jp/shinsei/data_pdf/kotu/shako/hokan-1.pdf";
		this.appforms.get(1).page = 7;
		this.appforms.get(1).maxSide = 340;
		this.appforms.get(1).imgposY = 120;
		this.appforms.get(1).imgposXov = 85;
		this.appforms.get(1).imgposXzm = 448;

		// 青森県
		this.appforms.get(2).distUrl = "https://www.police.pref.aomori.jp/koutubu/kisei/b7_syako_syomei.html";
		this.appforms.get(2).pdfUrl = "https://www.police.pref.aomori.jp/koutubu/kisei/pdf/pdf/6-6.PDF";
		this.appforms.get(2).page = 1;
		this.appforms.get(2).maxSide = 310;
		this.appforms.get(2).imgposY = 144;
		this.appforms.get(2).imgposXov = 86;
		this.appforms.get(2).imgposXzm = 431;

		// 岩手県
		this.appforms.get(3).distUrl = "http://www2.pref.iwate.jp/~hp0802/oshirase/kou-kisei/hokanbasyo/index.html";

		// 宮城県
		this.appforms.get(4).distUrl = "http://www.police.pref.miyagi.jp/hp/kisei/syako/car.htm";
		this.appforms.get(4).pdfUrl = "http://www.police.pref.miyagi.jp/hp/kisei/syako/syozaizu.pdf";
		this.appforms.get(4).page = 1;
		this.appforms.get(4).maxSide = 280;
		this.appforms.get(4).imgposY = 190;
		this.appforms.get(4).imgposXov = 100;
		this.appforms.get(4).imgposXzm = 460;




		// 神奈川県
		this.appforms.get(14).pdfUrl = "https://www.police.pref.kanagawa.jp/pdf/f4020_02.pdf";
		this.appforms.get(14).page = 3;
		this.appforms.get(14).maxSide = 340;
		this.appforms.get(14).imgposY = 170;
		this.appforms.get(14).imgposXov = 70;
		this.appforms.get(14).imgposXzm = 428;


	}

	public Map<Integer, GrgmapAppForm> findAll()
	{
		return this.appforms;
	}
}
