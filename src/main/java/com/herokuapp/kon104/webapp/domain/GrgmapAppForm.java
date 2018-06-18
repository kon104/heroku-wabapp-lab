package com.herokuapp.kon104.webapp.domain;

public class GrgmapAppForm
{
	public int code;
	public String pref;
	public String pdfUrl;
	public String distUrl;
	public int page;
	public int quadrant;
	public boolean transform;
	public int maxSide;
	public int imgposY;
	public int imgposXov;
	public int imgposXzm;

	public GrgmapAppForm(int code, String pref)
	{
		this(code, pref, null, null);
	}

	public GrgmapAppForm(int code, String pref, String distUrl, String pdfUrl)
	{
		this.code = code;
		this.pref = pref;
		this.distUrl = distUrl;
		this.pdfUrl = pdfUrl;
		this.page = 1;
		this.quadrant = 0;
		this.transform = false;
		this.maxSide = Integer.MAX_VALUE;
		this.imgposY = 0;
		this.imgposXov = 0;
		this.imgposXzm = 0;
	}
}
