package com.nayak.pickphotographers.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nayak.pickphotographers.constant.PhotographersConstant;
import com.nayak.pickphotographers.entity.ContactRequest;
import com.nayak.pickphotographers.repository.ContactRequestRepository;

@Service
public class ContactRequestServiceImpl implements ContactRequestService {

	@Autowired
	ContactRequestRepository contactRequestRepository;

	@Override
	public ContactRequest saveContactRequest(ContactRequest contactRequest) {
		contactRequest.setIsRead(PhotographersConstant.N);
		contactRequest.setEntDt(new Date());
		System.out.println("service : ");
		return contactRequestRepository.save(contactRequest);
	}

}
