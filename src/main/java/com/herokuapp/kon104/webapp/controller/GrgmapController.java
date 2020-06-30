package com.herokuapp.kon104.webapp.controller;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.common.PDStream;
import org.springframework.http.HttpEntity;

import java.io.FileInputStream;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.beans.factory.annotation.Autowired;
import org.apache.pdfbox.pdfparser.PDFParser;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.util.Base64;
import java.net.URL;
import java.net.URI;
import java.net.URISyntaxException;
import java.io.InputStream;
import java.net.URLConnection;
import com.herokuapp.kon104.webapp.domain.GrgmapAppFormService;
import com.herokuapp.kon104.webapp.domain.GrgmapAppForm;
import java.util.Map;
import org.apache.pdfbox.util.Matrix;
import org.apache.pdfbox.pdmodel.common.PDRectangle;


/**
 * Garage Map
 *
 */
@Controller
@RequestMapping("/grgmap")
public class GrgmapController
{

	private static final Logger logger = LoggerFactory.getLogger(GrgmapController.class);

	private String gmapApiKey = "AIzaSyBCYBPbwRyLV_urAoagNVlNn2T3BHspQW4";
//	private String gmapApiKey = "AIzaSyCErcdJQ5Pc1jP5pKhaKsBMruAM0GE8tnI";

	@Autowired
	GrgmapAppFormService gafservice;

	@Autowired
	ResourceLoader resourceLoader;

	// {{{ public String index(Model model)
	@RequestMapping("/")
	public String index(Model model)
	{
		model.addAttribute("appforms", gafservice.findAll());
		model.addAttribute("lat", 35.47131841901187);
		model.addAttribute("lng", 139.4283853703149);
		model.addAttribute("gmapApiKey", gmapApiKey);

		return "grgmap/index";
	}
	// }}}

	// {{{ public String new(Model model)
	@RequestMapping("/new")
	public String index2(Model model)
	{
		model.addAttribute("appforms", gafservice.findAll());
		model.addAttribute("lat", 35.47131841901187);
		model.addAttribute("lng", 139.4283853703149);
		model.addAttribute("gmapApiKey", gmapApiKey);

		return "grgmap/new";
	}
	// }}}



	// {{{ public ResponseEntity<byte[]> text() throws IOException
	@RequestMapping(value = "/text", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<byte[]> text() throws IOException
	{
		String data = "Hello world!!!!!";

		HttpHeaders headers = new HttpHeaders();
		headers.add("header1", "heaer1-value");
		headers.add("Content-type", "text/plain");

		HttpStatus status = HttpStatus.OK;

		return new ResponseEntity<byte[]>(data.getBytes("MS932"), headers, status);
	}
	// }}}

	// {{{ public ResponseEntity<byte[]> csv() throws IOException
	@RequestMapping(value = "/csv", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<byte[]> csv() throws IOException
	{
		HttpHeaders h = new HttpHeaders();
		h.add("Content-Type", "text/csv; charset=MS932");
		String filename = "test";
		h.setContentDispositionFormData("filename", filename + ".csv");
		String CSVData = null;
		try{
			StringBuilder CSV = new StringBuilder();
			CSV.append("ssss");
			CSV.append("aaaa");
			CSVData = CSV.toString();
		}catch(Exception e){
			System.out.println(e);
			CSVData = null;
		}
		byte[] csvBytes = CSVData.getBytes("MS932");
		return new ResponseEntity<byte[]>(csvBytes, h, HttpStatus.OK);
	}
	// }}}

	// {{{ public ResponseEntity<byte[]> pdfcreator()
	@RequestMapping(value = "/pdfcreator", method = RequestMethod.GET)
	@ResponseBody
	public ResponseEntity<byte[]> pdfcreator()
	{
		byte[] pdfBytes = null;

		try (PDDocument pdfDoc = new PDDocument()) {
			PDPage page = new PDPage();
			pdfDoc.addPage(page);

			PDPageContentStream cs = new PDPageContentStream(pdfDoc, page);
			cs.beginText();
			cs.setFont(PDType1Font.HELVETICA, 20);
			cs.newLineAtOffset(100, 700);
			cs.showText("Hello World");
			cs.endText();
			cs.close();

			ByteArrayOutputStream out = new ByteArrayOutputStream();
//			pdfDoc.save(System.getProperty("java.io.tmpdir") + "zzzzz.pdf");
			pdfDoc.save(out);
			pdfBytes = out.toByteArray();

		} catch(IOException e) {
			System.err.println(e);
		}

		HttpHeaders h = new HttpHeaders();
		h.add("Content-Type", "application/pdf");

		return new ResponseEntity<byte[]>(pdfBytes, h, HttpStatus.OK);
	}
	// }}}

	// {{{ public ResponseEntity<byte[]> pdfeditor()
	@RequestMapping(value = "/pdfeditor", method = {RequestMethod.GET, RequestMethod.POST})
	@ResponseBody
	public ResponseEntity<byte[]> pdfeditor(
		@RequestParam("img_map_ov") String img_ov,
		@RequestParam("img_map_zm") String img_zm,
		@RequestParam("pref") String pref_code)
	{
		if (img_ov.isEmpty()) {
			// TBD
		}
		if (img_zm.isEmpty()) {
			// TBD
		}

		byte[] imgOvByte = Base64.getDecoder().decode(img_ov);
		byte[] imgZmByte = Base64.getDecoder().decode(img_zm);

		File imgOvFile = null;
		File imgZmFile = null;

		byte[] pdfBytes = null;

		try {

			// create image of map (overview)
			imgOvFile = File.createTempFile("GrgmapImgOv", ".png");
			BufferedOutputStream imgOvStream = new BufferedOutputStream(new FileOutputStream(imgOvFile));
			imgOvStream.write(imgOvByte);
			imgOvStream.close();

			// create image of map (zoom)
			imgZmFile = File.createTempFile("GrgmapImgZm", ".png");
			BufferedOutputStream imgZmStream = new BufferedOutputStream(new FileOutputStream(imgZmFile));
			imgZmStream.write(imgZmByte);
			imgZmStream.close();

			// create a pdf covering image of map
			Map<Integer, GrgmapAppForm> appformlist = gafservice.findAll();
			GrgmapAppForm appform = appformlist.get(Integer.parseInt(pref_code));

			String pdfAddr = appform.pdfUrl;

			InputStream pdfIs = null;
			if (pdfAddr.startsWith("http")) {
				URL pdfUrl = new URL(pdfAddr);
//				URLConnection pdfConn = pdfUrl.openConnection();
//				logger.info("URLConnection Content-Type: " + pdfConn.getContentType());
//				if (!pdfConn.getContentType().equalsIgnoreCase("application/pdf")) {
//					// ToDo: failuer to get pdf
//				}
				pdfIs = pdfUrl.openStream();
			} else {
				Resource resource = resourceLoader.getResource(pdfAddr);
				pdfIs = resource.getInputStream();
			}
			PDDocument pdfDoc = PDDocument.load(pdfIs);

			pdfIs.close();

			for (int idx = 1, totalpage = pdfDoc.getNumberOfPages(); idx <= totalpage; idx++){
				if (idx < appform.page) {
					pdfDoc.removePage(0);
				} else
				if (idx > appform.page) {
					pdfDoc.removePage(1);
				}
			}
			PDPage page = pdfDoc.getPage(0);
			if (appform.quadrant > 0) {
				page.setRotation(appform.quadrant * 90);
			}

			PDPageContentStream cs = new PDPageContentStream(pdfDoc, page, PDPageContentStream.AppendMode.APPEND, true);
			if (appform.transform == true) {
				cs.transform(new Matrix(0, 1, -1, 0, page.getMediaBox().getWidth(), 0));
			}

			PDImageXObject imgOv = PDImageXObject.createFromFileByContent(imgOvFile, pdfDoc);
			PDImageXObject imgZm = PDImageXObject.createFromFileByContent(imgZmFile, pdfDoc);

			int maxSide = appform.maxSide;
			float scale_x = (float) maxSide / imgOv.getWidth();
			float scale_y = (float) maxSide / imgZm.getWidth();
			float scale = Float.MAX_VALUE;
			scale = (scale < scale_x) ? scale : scale_x;
			scale = (scale < scale_y) ? scale : scale_y;

			int imgposY = appform.imgposY;
			int imgposXov = appform.imgposXov;
			int imgposXzm = appform.imgposXzm;
			cs.drawImage(imgOv, imgposXov, imgposY, imgOv.getWidth() * scale, imgOv.getHeight() * scale);
			cs.drawImage(imgZm, imgposXzm, imgposY, imgZm.getWidth() * scale, imgZm.getHeight() * scale);
			cs.close();

			ByteArrayOutputStream out = new ByteArrayOutputStream();
			pdfDoc.save(out);
			pdfBytes = out.toByteArray();
		} catch(IOException e) {
			System.err.println(e);
		} finally {
			if ((imgOvFile != null) && (imgOvFile.exists())) {
				imgOvFile.delete();
			}
			if ((imgZmFile != null) && (imgZmFile.exists())) {
				imgZmFile.delete();
			}
		}

		HttpHeaders h = new HttpHeaders();
		h.add("Content-Type", "application/pdf");

		return new ResponseEntity<byte[]>(pdfBytes, h, HttpStatus.OK);
	}
	// }}}

}
