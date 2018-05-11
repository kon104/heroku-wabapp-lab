package com.herokuapp.kon104.webapp;

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
import com.herokuapp.kon104.webapp.service.GrgmapAppFormService;
import com.herokuapp.kon104.webapp.domain.GrgmapAppForm;
import java.util.Map;


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
		String tmpDir = System.getProperty("java.io.tmpdir");
		File tmpFile = null;
		String tmpPath = null;
		try {
			tmpFile = File.createTempFile("prefix", ".suffix");
			tmpPath = tmpFile.getPath();
		} catch(IOException e) {
			System.err.println(e.getMessage());
		} finally {
			if (tmpFile != null && tmpFile.exists()) {
				tmpFile.delete();
			}
		}
 
		model.addAttribute("tmpdir", tmpDir);
		model.addAttribute("tmppath", tmpPath);

		model.addAttribute("appforms", gafservice.findAll());
		model.addAttribute("lat", 35.47131841901187);
		model.addAttribute("lng", 139.4283853703149);
		model.addAttribute("gmapApiKey", gmapApiKey);

		return "grgmap/index";
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

			String pdfAddr = appform.url;
			URL pdfUrl = new URL(pdfAddr);
			URLConnection pdfConn = pdfUrl.openConnection();
			if (!pdfConn.getContentType().equalsIgnoreCase("application/pdf")) {
				// ToDo: failuer to get pdf
			}
			InputStream pdfIs = pdfUrl.openStream();
			PDDocument pdfDoc = PDDocument.load(pdfIs);
			pdfIs.close();

			pdfDoc.removePage(0);
			pdfDoc.removePage(0);
			PDPage page = pdfDoc.getPage(0);
			PDPageContentStream cs = new PDPageContentStream(pdfDoc, page, PDPageContentStream.AppendMode.APPEND, true);

			PDImageXObject imgOv = PDImageXObject.createFromFileByContent(imgOvFile, pdfDoc);
			PDImageXObject imgZm = PDImageXObject.createFromFileByContent(imgZmFile, pdfDoc);

			int max_side = appform.max_side;
			float scale_x = (float) max_side / imgOv.getWidth();
			float scale_y = (float) max_side / imgZm.getWidth();
			float scale = Float.MAX_VALUE;
			scale = (scale < scale_x) ? scale : scale_x;
			scale = (scale < scale_y) ? scale : scale_y;

			int imgpos_y = appform.imgpos_y;
			int imgpos_x_ov = appform.imgpos_x_ov;
			int imgpos_x_zm = appform.imgpos_x_zm;
			cs.drawImage(imgOv, imgpos_x_ov, imgpos_y, imgOv.getWidth() * scale, imgOv.getHeight() * scale);
			cs.drawImage(imgZm, imgpos_x_zm, imgpos_y, imgZm.getWidth() * scale, imgZm.getHeight() * scale);
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
