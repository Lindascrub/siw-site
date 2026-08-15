package it.uniroma3.siw.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletResponse;



@ControllerAdvice(basePackages = "it.uniroma3.siw.controller")
public class MvcExceptionHandler {

	@ExceptionHandler(ResourceNotFoundException.class)
	 public ModelAndView handleNotFound(ResourceNotFoundException ex, HttpServletResponse response) {
        response.setStatus(HttpStatus.NOT_FOUND.value());
        ModelAndView mav = new ModelAndView("error/error");
        mav.addObject("message", ex.getMessage());
        return mav;
    }

	 @ExceptionHandler({BusinessRuleException.class, DuplicateReviewException.class})
	    public ModelAndView handleBusinessRule(RuntimeException ex, HttpServletResponse response) {
	        response.setStatus(HttpStatus.CONFLICT.value());
	        ModelAndView mav = new ModelAndView("error/error");
	        mav.addObject("message", ex.getMessage());
	        return mav;
	    }

	    @ExceptionHandler(ForbiddenOperationException.class)
	    public ModelAndView handleForbidden(ForbiddenOperationException ex, HttpServletResponse response) {
	        response.setStatus(HttpStatus.FORBIDDEN.value());
	        ModelAndView mav = new ModelAndView("error/error");
	        mav.addObject("message", ex.getMessage());
	        return mav;
	    }
}
