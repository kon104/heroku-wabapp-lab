package com.herokuapp.kon104.webapp.domain;

public class GrgmapAppForm
{
	public int code;
	public String pref;
	public String url;
	public int page;
	public int max_side;
	public int imgpos_y;
	public int imgpos_x_ov;
	public int imgpos_x_zm;

	public GrgmapAppForm(int code, String pref)
	{
		this(code, pref, null);
	}

	public GrgmapAppForm(int code, String pref, String url)
	{
		this.code = code;
		this.pref = pref;
		this.url = url;
		this.page = 1;
		this.max_side = Integer.MAX_VALUE;
		this.imgpos_y = 0;
		this.imgpos_x_ov = 0;
		this.imgpos_x_zm = 0;
	}
}
