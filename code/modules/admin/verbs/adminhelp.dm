

//This is a list of words which are ignored by the parser when comparing message contents for names. MUST BE IN LOWER CASE!
var/list/adminhelp_ignored_words = list("unknown","the","a","an","of","monkey","alien","as")

/client/verb/adminhelp()
	set category = "Admin"
	set name = "Adminhelp"

	//handle muting and automuting
	if(prefs.muted & MUTE_ADMINHELP)
		src << "<font color='red'>Error: Admin-PM: You cannot send adminhelps (Muted).</font>"
		return

	adminhelped = 1 //Determines if they get the message to reply by clicking the name.

	/**src.verbs -= /client/verb/adminhelp

	spawn(1200)
		src.verbs += /client/verb/adminhelp	// 2 minute cool-down for adminhelps
		src.verbs += /client/verb/adminhelp	// 2 minute cool-down for adminhelps//Go to hell
	**/
	var/msg
	var/list/type = list("Question","Player Complaint")
	var/selected_type = input("Pick a category.", "Admin Help", null, null) as null|anything in type
	if(selected_type)
		msg = input("Please enter your message.", "Admin Help", null, null) as text

	//clean the input msg
	if(!msg)	return

	if(src.handle_spam_prevention(msg,MUTE_ADMINHELP))
		return

	msg = sanitize(copytext(msg,1,MAX_MESSAGE_LEN))
	if(!msg)	return
	var/original_msg = msg



	//explode the input msg into a list
	var/list/msglist = text2list(msg, " ")

	//generate keywords lookup
	var/list/surnames = list()
	var/list/forenames = list()
	var/list/ckeys = list()
	for(var/mob/M in mob_list)
		var/list/indexing = list(M.real_name, M.name)
		if(M.mind)	indexing += M.mind.name

		for(var/string in indexing)
			var/list/L = text2list(string, " ")
			var/surname_found = 0
			//surnames
			for(var/i=L.len, i>=1, i--)
				var/word = ckey(L[i])
				if(word)
					surnames[word] = M
					surname_found = i
					break
			//forenames
			for(var/i=1, i<surname_found, i++)
				var/word = ckey(L[i])
				if(word)
					forenames[word] = M
			//ckeys
			ckeys[M.ckey] = M

	var/ai_found = 0
	msg = ""
	var/list/mobs_found = list()
	for(var/original_word in msglist)
		var/word = ckey(original_word)
		if(word)
			if(!(word in adminhelp_ignored_words))
				if(word == "ai")
					ai_found = 1
				else
					var/mob/found = ckeys[word]
					if(!found)
						found = surnames[word]
						if(!found)
							found = forenames[word]
					if(found)
						if(!(found in mobs_found))
							mobs_found += found
							if(!ai_found && isAI(found))
								ai_found = 1
							msg += "<b><font color='black'>[original_word] </font></b> "
							continue
			msg += "[original_word] "

	if(!mob)	return						//this doesn't happen

	var/ref_mob = "\ref[mob]"
	msg = "\blue <b><font color=red>[selected_type]: </font>[key_name(src, 1, 1, selected_type)] (<A HREF='?_src_=holder;adminmoreinfo=[ref_mob]'>?</A>) (<A HREF='?_src_=holder;adminplayeropts=[ref_mob]'>PP</A>) (<A HREF='?_src_=vars;Vars=[ref_mob]'>VV</A>) (<A HREF='?_src_=holder;subtlemessage=[ref_mob]'>SM</A>) ([admin_jump_link(mob, "holder")]) (<A HREF='?_src_=holder;check_antagonist=1'>CA</A>) [ai_found ? " (<A HREF='?_src_=holder;adminchecklaws=[ref_mob]'>CL</A>)" : ""]:</b> [msg]"

	//send this msg to all admins
	var/admin_number_afk = 0
	var/list/modholders = list()
	var/list/banholders = list()
	var/list/adminholders = list()
	for(var/client/X in admins)
		if((R_MOD | R_MENTOR) & X.holder.rights)
			if(X.is_afk())
				admin_number_afk++
			modholders += X
		if(R_ADMIN & X.holder.rights)
			if(X.is_afk())
				admin_number_afk++
			adminholders += X
		if(R_BAN & X.holder.rights)
			banholders += X

	switch(selected_type)
		if("Question")
			if(modholders.len)
				for(var/client/X in modholders)
					if(X.prefs.sound & SOUND_ADMINHELP)
						X << 'sound/effects/adminhelp.ogg'
					X << msg
			else
				if(adminholders.len)
					for(var/client/X in adminholders)
						if(X.prefs.sound & SOUND_ADMINHELP)
							X << 'sound/effects/adminhelp.ogg'
						X << msg
		else if("Player Complaint")
			if(banholders.len)
				for(var/client/X in banholders)
					if(X.prefs.sound & SOUND_ADMINHELP)
						X << 'sound/effects/adminhelp.ogg'
					X << msg

	//show it to the person adminhelping too
	src << "<font color='blue'><b>[selected_type]</b>: [original_msg]</font>"

	var/admin_number_present = admins.len - admin_number_afk
	log_admin("[selected_type]: [key_name(src)]: [original_msg] - heard by [admin_number_present] non-AFK admins.")
	if(admin_number_present <= 0)
		if(!admin_number_afk)
			send2adminirc("[selected_type] from [key_name(src)]: [original_msg] - !!No admins online!!")
		else
			send2adminirc("[selected_type] from [key_name(src)]: [original_msg] - !!All admins AFK ([admin_number_afk])!!")
	else
		send2adminirc("[selected_type] from [key_name(src)]: [original_msg]")
	feedback_add_details("admin_verb","AH") //If you are copy-pasting this, ensure the 2nd parameter is unique to the new proc!
	return

/proc/send2irc_adminless_only(source, msg, requiredflags = R_BAN)
	var/admin_number_total = 0		//Total number of admins
	var/admin_number_afk = 0		//Holds the number of admins who are afk
	var/admin_number_ignored = 0	//Holds the number of admins without +BAN (so admins who are not really admins)
	var/admin_number_decrease = 0	//Holds the number of admins with are afk, ignored or both
	for(var/client/X in admins)
		admin_number_total++;
		var/invalid = 0
		if(requiredflags != 0 && !check_rights_for(X, requiredflags))
			admin_number_ignored++
			invalid = 1
		if(X.is_afk())
			admin_number_afk++
			invalid = 1
		if(X.holder.fakekey)
			admin_number_ignored++
			invalid = 1
		if(invalid)
			admin_number_decrease++
	var/admin_number_present = admin_number_total - admin_number_decrease	//Number of admins who are neither afk nor invalid
	if(admin_number_present <= 0)
		if(!admin_number_afk && !admin_number_ignored)
			send2irc(source, "[msg] - No admins online")
		else
			send2irc(source, "[msg] - All admins AFK ([admin_number_afk]/[admin_number_total]) or skipped ([admin_number_ignored]/[admin_number_total])")
	return admin_number_present
	